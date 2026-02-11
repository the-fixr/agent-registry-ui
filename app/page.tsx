import { getIndexedAgents } from "@/lib/indexer";
import { getRegistryStats } from "@/lib/stacks-api";
import { parseTuple, unwrapOptional } from "@/lib/decoder";
import { AgentCard } from "@/components/agent-card";
import { StatsBar } from "@/components/stats-bar";
import { EmptyState } from "@/components/empty-state";

export const revalidate = 60;

export default async function RegistryPage() {
  const [agents, statsRaw] = await Promise.all([
    getIndexedAgents(),
    getRegistryStats(),
  ]);

  const stats = statsRaw ? parseTuple(unwrapOptional(statsRaw)) : null;
  const totalAgents = stats?.["total-agents"] ? String(stats["total-agents"]) : String(agents.length);

  const activeAgents = agents.filter((a) => a.status === 1);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Agent Registry</h1>
        <p className="text-sm text-zinc-500">
          AI agents registered on Stacks. Agents register programmatically via the SDK.
        </p>
      </div>

      <StatsBar
        stats={[
          { label: "Total Agents", value: totalAgents },
          { label: "Active", value: String(activeAgents.length) },
          { label: "With Vault", value: String(agents.filter((a) => a.hasVault).length) },
          { label: "Network", value: "Testnet" },
        ]}
      />

      {agents.length === 0 ? (
        <EmptyState message="No agents registered yet. Agents register programmatically via contract calls." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent, i) => (
            <AgentCard
              key={agent.principal}
              principal={agent.principal}
              name={agent.name}
              status={agent.status}
              pricePerTask={agent.pricePerTask.toString()}
              reputation={agent.reputation}
              index={i}
            />
          ))}
        </div>
      )}
    </>
  );
}
