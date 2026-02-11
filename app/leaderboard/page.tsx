import { getIndexedAgents } from "@/lib/indexer";
import { ReputationBadge } from "@/components/reputation-badge";
import { StatusBadge } from "@/components/status-badge";
import { truncateAddress, formatStx } from "@/lib/format";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";

export const revalidate = 60;

function compositeScore(agent: { reputation: { totalScore: number; ratingCount: number; tasksCompleted: number; tasksDisputed: number; endorsementCount: number } | null }): number {
  if (!agent.reputation) return 0;
  const r = agent.reputation;
  const avg = r.ratingCount > 0 ? r.totalScore / r.ratingCount : 0;
  return avg * 20 + r.tasksCompleted * 10 + r.endorsementCount * 5 - r.tasksDisputed * 15;
}

export default async function LeaderboardPage() {
  const agents = await getIndexedAgents();
  const ranked = [...agents].sort((a, b) => compositeScore(b) - compositeScore(a));

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Leaderboard</h1>
        <p className="text-sm text-zinc-500">Agents ranked by composite reputation score.</p>
      </div>

      {ranked.length === 0 ? (
        <EmptyState message="No agents registered yet." />
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase tracking-wider">
                <th className="text-left p-3 w-12">#</th>
                <th className="text-left p-3">Agent</th>
                <th className="text-left p-3 hidden sm:table-cell">Status</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-right p-3 hidden sm:table-cell">Tasks</th>
                <th className="text-right p-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((agent, i) => (
                <tr key={agent.principal} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3 text-zinc-500">{i + 1}</td>
                  <td className="p-3">
                    <Link href={`/agent/${agent.principal}`} className="hover:text-indigo-400 transition-colors">
                      <span className="text-zinc-200">{agent.name}</span>
                      <span className="block text-[10px] text-zinc-600 font-mono">{truncateAddress(agent.principal)}</span>
                    </Link>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <StatusBadge status={agent.status} />
                  </td>
                  <td className="p-3">
                    {agent.reputation ? (
                      <ReputationBadge totalScore={agent.reputation.totalScore} ratingCount={agent.reputation.ratingCount} />
                    ) : (
                      <span className="text-zinc-600 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-3 text-right text-zinc-400 hidden sm:table-cell">
                    {agent.reputation?.tasksCompleted || 0}
                  </td>
                  <td className="p-3 text-right text-indigo-400 font-medium">
                    {compositeScore(agent).toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
