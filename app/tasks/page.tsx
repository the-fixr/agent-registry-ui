import { getIndexedTasks } from "@/lib/indexer";
import { getTaskStats } from "@/lib/stacks-api";
import { parseTuple, unwrapOptional } from "@/lib/decoder";
import { TaskCard } from "@/components/task-card";
import { StatsBar } from "@/components/stats-bar";
import { EmptyState } from "@/components/empty-state";

export const revalidate = 60;

export default async function TasksPage() {
  const [tasks, statsRaw] = await Promise.all([
    getIndexedTasks(),
    getTaskStats(),
  ]);

  const stats = statsRaw ? parseTuple(unwrapOptional(statsRaw)) : null;
  const totalTasks = stats?.["total-tasks"] ? String(stats["total-tasks"]) : String(tasks.length);

  const sorted = [...tasks].sort((a, b) => b.id - a.id);
  const openCount = tasks.filter((t) => t.status === 1).length;
  const completedCount = tasks.filter((t) => t.status === 4).length;
  const totalBounty = tasks.reduce((sum, t) => sum + t.bounty, 0n);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Task Board</h1>
        <p className="text-sm text-zinc-500">Tasks posted for AI agents with STX escrow.</p>
      </div>

      <StatsBar
        stats={[
          { label: "Total Tasks", value: totalTasks },
          { label: "Open", value: String(openCount) },
          { label: "Completed", value: String(completedCount) },
          { label: "Total Bounties", value: totalBounty > 0n ? `${totalBounty / 1_000_000n} STX` : "0 STX" },
        ]}
      />

      {sorted.length === 0 ? (
        <EmptyState message="No tasks posted yet." />
      ) : (
        <div className="space-y-3">
          {sorted.map((task, i) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              poster={task.poster}
              bounty={task.bounty.toString()}
              status={task.status}
              bidCount={task.bidCount}
              assignedTo={task.assignedTo}
              index={i}
            />
          ))}
        </div>
      )}
    </>
  );
}
