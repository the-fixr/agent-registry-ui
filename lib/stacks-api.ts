import { HIRO_API, DEPLOYER } from "./config";
import { encodePrincipal, encodeUint, decodeResult } from "./decoder";

// Make a read-only contract call
export async function callReadOnly(
  contractName: string,
  fnName: string,
  args: string[] = []
): Promise<any> {
  const url = `${HIRO_API}/v2/contracts/call-read/${DEPLOYER}/${contractName}/${fnName}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: DEPLOYER, arguments: args }),
    next: { revalidate: 60 },
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  if (!data.okay || data.okay === "false") return null;
  return decodeResult(data.result);
}

// Fetch contract events with pagination
export async function fetchContractEvents(
  contractId: string,
  limit = 50,
  offset = 0
): Promise<{ results: any[]; total: number }> {
  const url = `${HIRO_API}/extended/v1/contract/${contractId}/events?limit=${limit}&offset=${offset}`;
  const resp = await fetch(url, { next: { revalidate: 60 } });
  if (!resp.ok) return { results: [], total: 0 };
  return resp.json();
}

// Fetch ALL events from a contract (paginated)
export async function fetchAllContractEvents(contractId: string): Promise<any[]> {
  const events: any[] = [];
  let offset = 0;
  const limit = 50;
  while (true) {
    const data = await fetchContractEvents(contractId, limit, offset);
    events.push(...data.results);
    if (data.results.length < limit) break;
    offset += limit;
  }
  return events;
}

// Convenience: get-agent
export async function getAgent(principal: string) {
  return callReadOnly("agent-registry", "get-agent", [encodePrincipal(principal)]);
}

// Convenience: get-reputation
export async function getReputation(principal: string) {
  return callReadOnly("reputation", "get-reputation", [encodePrincipal(principal)]);
}

// Convenience: get-average-score
export async function getAverageScore(principal: string) {
  return callReadOnly("reputation", "get-average-score", [encodePrincipal(principal)]);
}

// Convenience: get-capability
export async function getCapability(principal: string, index: number) {
  return callReadOnly("agent-registry", "get-capability", [
    encodePrincipal(principal),
    encodeUint(index),
  ]);
}

// Convenience: get-vault
export async function getVault(principal: string) {
  return callReadOnly("agent-vault", "get-vault", [encodePrincipal(principal)]);
}

// Convenience: get-task
export async function getTask(id: number) {
  return callReadOnly("task-board", "get-task", [encodeUint(id)]);
}

// Convenience: get-bid-count
export async function getBidCount(taskId: number) {
  return callReadOnly("task-board", "get-bid-count", [encodeUint(taskId)]);
}

// Convenience: get-bid-at
export async function getBidAt(taskId: number, index: number) {
  return callReadOnly("task-board", "get-bid-at", [encodeUint(taskId), encodeUint(index)]);
}

// Convenience: get-bid
export async function getBid(taskId: number, bidder: string) {
  return callReadOnly("task-board", "get-bid", [encodeUint(taskId), encodePrincipal(bidder)]);
}

// Convenience: get-stats (registry)
export async function getRegistryStats() {
  return callReadOnly("agent-registry", "get-stats", []);
}

// Convenience: get-stats (task-board)
export async function getTaskStats() {
  return callReadOnly("task-board", "get-stats", []);
}

// Convenience: get-curve (launchpad)
export async function getCurve(id: number) {
  return callReadOnly("agent-launchpad", "get-curve", [encodeUint(id)]);
}

// Convenience: get-balance (launchpad)
export async function getCurveBalance(curveId: number, holder: string) {
  return callReadOnly("agent-launchpad", "get-balance", [encodeUint(curveId), encodePrincipal(holder)]);
}

// Convenience: get-agent-curve
export async function getAgentCurve(agent: string) {
  return callReadOnly("agent-launchpad", "get-agent-curve", [encodePrincipal(agent)]);
}

// Convenience: get-buy-quote
export async function getBuyQuote(curveId: number, stxAmount: number) {
  return callReadOnly("agent-launchpad", "get-buy-quote", [encodeUint(curveId), encodeUint(stxAmount)]);
}

// Convenience: get-sell-quote
export async function getSellQuote(curveId: number, tokenAmount: number) {
  return callReadOnly("agent-launchpad", "get-sell-quote", [encodeUint(curveId), encodeUint(tokenAmount)]);
}

// Convenience: get-price
export async function getCurvePrice(curveId: number) {
  return callReadOnly("agent-launchpad", "get-price", [encodeUint(curveId)]);
}

// Convenience: get-stats (launchpad)
export async function getLaunchpadStats() {
  return callReadOnly("agent-launchpad", "get-stats", []);
}
