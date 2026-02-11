import { CONTRACTS, CACHE_TTL_MS } from "./config";
import { fetchAllContractEvents } from "./stacks-api";
import { decodeResult, parseTuple } from "./decoder";
import type { IndexedAgent, IndexedTask, IndexedCurve } from "./types";

interface IndexState {
  agents: Map<string, IndexedAgent>;
  tasks: Map<number, IndexedTask>;
  curves: Map<number, IndexedCurve>;
  lastUpdated: number;
}

let state: IndexState | null = null;

function parseEventValue(event: any): Record<string, any> | null {
  try {
    if (!event?.contract_log?.value?.hex) return null;
    const decoded = decodeResult(event.contract_log.value.hex);
    return parseTuple(decoded);
  } catch {
    return null;
  }
}

async function buildIndex(): Promise<IndexState> {
  const agents = new Map<string, IndexedAgent>();
  const tasks = new Map<number, IndexedTask>();
  const curves = new Map<number, IndexedCurve>();

  // Fetch events from registry
  const registryEvents = await fetchAllContractEvents(CONTRACTS.registry);
  for (const evt of registryEvents) {
    const data = parseEventValue(evt);
    if (!data || !data.event) continue;

    if (data.event === "agent-registered") {
      const principal = typeof data.owner === "string" ? data.owner : String(data.owner);
      agents.set(principal, {
        principal,
        name: typeof data.name === "string" ? data.name : String(data.name || "Unknown"),
        status: 1,
        registeredAt: Number(data["registered-at"] || 0),
        pricePerTask: BigInt(data["price-per-task"] || 0),
        reputation: null,
        hasVault: false,
      });
    } else if (data.event === "status-changed" && data.owner) {
      const principal = String(data.owner);
      const existing = agents.get(principal);
      if (existing) {
        existing.status = Number(data.status || data["new-status"] || 1);
      }
    }
  }

  // Fetch events from task-board
  const taskEvents = await fetchAllContractEvents(CONTRACTS.taskBoard);
  for (const evt of taskEvents) {
    const data = parseEventValue(evt);
    if (!data || !data.event) continue;

    if (data.event === "task-posted") {
      const id = Number(data["task-id"] || 0);
      tasks.set(id, {
        id,
        poster: String(data.poster || ""),
        title: String(data.title || ""),
        bounty: BigInt(data.bounty || 0),
        status: 1,
        createdAt: Number(data["created-at"] || 0),
        deadline: Number(data.deadline || 0),
        assignedTo: null,
        bidCount: 0,
      });
    } else if (data.event === "bid-placed") {
      const id = Number(data["task-id"] || 0);
      const task = tasks.get(id);
      if (task) task.bidCount++;
    } else if (data.event === "task-assigned") {
      const id = Number(data["task-id"] || 0);
      const task = tasks.get(id);
      if (task) {
        task.status = 2;
        task.assignedTo = String(data.agent || "");
      }
    } else if (data.event === "work-submitted") {
      const id = Number(data["task-id"] || 0);
      const task = tasks.get(id);
      if (task) task.status = 3;
    } else if (data.event === "task-approved") {
      const id = Number(data["task-id"] || 0);
      const task = tasks.get(id);
      if (task) task.status = 4;
    } else if (data.event === "task-disputed") {
      const id = Number(data["task-id"] || 0);
      const task = tasks.get(id);
      if (task) task.status = 5;
    } else if (data.event === "task-cancelled") {
      const id = Number(data["task-id"] || 0);
      const task = tasks.get(id);
      if (task) task.status = 6;
    } else if (data.event === "task-expired") {
      const id = Number(data["task-id"] || 0);
      const task = tasks.get(id);
      if (task) task.status = 7;
    }
  }

  // Fetch vault events
  const vaultEvents = await fetchAllContractEvents(CONTRACTS.vault);
  for (const evt of vaultEvents) {
    const data = parseEventValue(evt);
    if (!data || data.event !== "vault-created") continue;
    const principal = String(data.owner || "");
    const agent = agents.get(principal);
    if (agent) agent.hasVault = true;
  }

  // Fetch reputation events
  const repEvents = await fetchAllContractEvents(CONTRACTS.reputation);
  for (const evt of repEvents) {
    const data = parseEventValue(evt);
    if (!data) continue;

    if (data.event === "task-completed-recorded") {
      const principal = String(data.agent || "");
      const agent = agents.get(principal);
      if (agent && agent.reputation) {
        agent.reputation.tasksCompleted++;
      }
    } else if (data.event === "agent-rated") {
      const principal = String(data.agent || "");
      const agent = agents.get(principal);
      if (agent) {
        if (!agent.reputation) {
          agent.reputation = { totalScore: 0, ratingCount: 0, tasksCompleted: 0, tasksDisputed: 0, endorsementCount: 0 };
        }
        agent.reputation.totalScore += Number(data.score || 0);
        agent.reputation.ratingCount++;
      }
    } else if (data.event === "agent-endorsed") {
      const principal = String(data.agent || "");
      const agent = agents.get(principal);
      if (agent) {
        if (!agent.reputation) {
          agent.reputation = { totalScore: 0, ratingCount: 0, tasksCompleted: 0, tasksDisputed: 0, endorsementCount: 0 };
        }
        agent.reputation.endorsementCount++;
      }
    } else if (data.event === "dispute-recorded") {
      const principal = String(data.agent || "");
      const agent = agents.get(principal);
      if (agent && agent.reputation) {
        agent.reputation.tasksDisputed++;
      }
    }
  }

  // Fetch launchpad events
  const launchpadEvents = await fetchAllContractEvents(CONTRACTS.launchpad);
  for (const evt of launchpadEvents) {
    const data = parseEventValue(evt);
    if (!data || !data.event) continue;

    if (data.event === "curve-launched") {
      const id = Number(data["curve-id"] || 0);
      curves.set(id, {
        id,
        creator: String(data.creator || ""),
        name: String(data.name || ""),
        symbol: String(data.symbol || ""),
        stxReserve: 0n,
        tokensSold: 0n,
        graduated: false,
        createdAt: Number(data["created-at"] || 0),
        tradeCount: 0,
      });
    } else if (data.event === "token-bought") {
      const id = Number(data["curve-id"] || 0);
      const curve = curves.get(id);
      if (curve) {
        curve.tradeCount++;
        curve.stxReserve = BigInt(data["new-stx-reserve"] || 0);
        curve.tokensSold = BigInt(data["new-tokens-sold"] || curve.tokensSold);
      }
    } else if (data.event === "token-sold") {
      const id = Number(data["curve-id"] || 0);
      const curve = curves.get(id);
      if (curve) {
        curve.tradeCount++;
        curve.stxReserve = BigInt(data["new-stx-reserve"] || 0);
      }
    } else if (data.event === "curve-graduated") {
      const id = Number(data["curve-id"] || 0);
      const curve = curves.get(id);
      if (curve) {
        curve.graduated = true;
      }
    }
  }

  return { agents, tasks, curves, lastUpdated: Date.now() };
}

export async function getIndex(): Promise<IndexState> {
  if (state && Date.now() - state.lastUpdated < CACHE_TTL_MS) {
    return state;
  }
  state = await buildIndex();
  return state;
}

export async function getIndexedAgents(): Promise<IndexedAgent[]> {
  const idx = await getIndex();
  return Array.from(idx.agents.values());
}

export async function getIndexedTasks(): Promise<IndexedTask[]> {
  const idx = await getIndex();
  return Array.from(idx.tasks.values());
}

export async function getIndexedCurves(): Promise<IndexedCurve[]> {
  const idx = await getIndex();
  return Array.from(idx.curves.values());
}
