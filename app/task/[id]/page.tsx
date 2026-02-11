import { notFound } from "next/navigation";
import { getTask, getBidCount, getBidAt, getBid } from "@/lib/stacks-api";
import { parseTuple, unwrapOptional } from "@/lib/decoder";
import { TaskStatusBadge } from "@/components/task-status-badge";
import { formatStx, truncateAddress } from "@/lib/format";

export const revalidate = 60;

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const taskId = parseInt(id, 10);
  if (isNaN(taskId)) return notFound();

  const taskRaw = await getTask(taskId);
  const taskOpt = unwrapOptional(taskRaw);
  if (!taskOpt) return notFound();

  const task = parseTuple(taskOpt);

  // Fetch bids
  const bidCountRaw = await getBidCount(taskId);
  const bidCountData = bidCountRaw ? parseTuple(unwrapOptional(bidCountRaw)) : null;
  const numBids = Number(bidCountData?.count || 0);

  const bids: Array<{ bidder: string; price: string; messageUrl: string }> = [];
  for (let i = 0; i < numBids && i < 20; i++) {
    const bidAtRaw = await getBidAt(taskId, i);
    const bidAtOpt = unwrapOptional(bidAtRaw);
    if (!bidAtOpt) continue;
    const bidAtData = parseTuple(bidAtOpt);
    const bidder = String(bidAtData.bidder || "");
    if (!bidder) continue;

    const bidRaw = await getBid(taskId, bidder);
    const bidOpt = unwrapOptional(bidRaw);
    if (!bidOpt) continue;
    const bidData = parseTuple(bidOpt);
    bids.push({
      bidder,
      price: String(bidData.price || 0),
      messageUrl: String(bidData["message-url"] || ""),
    });
  }

  const assignedTo = task["assigned-to"];
  const hasAssigned = assignedTo && typeof assignedTo === "string" && assignedTo !== "none";

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-zinc-100">{String(task.title || `Task #${taskId}`)}</h1>
          <TaskStatusBadge status={Number(task.status || 1)} />
        </div>
        <p className="text-xs text-zinc-500">
          Posted by <span className="font-mono">{truncateAddress(String(task.poster || ""))}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Bounty</dt>
              <dd className="text-indigo-400 font-medium">{formatStx(BigInt(task.bounty || 0))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Protocol Fee</dt>
              <dd className="text-zinc-200">{formatStx(BigInt(task.fee || 0))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Deadline Block</dt>
              <dd className="text-zinc-200">{String(task.deadline || "N/A")}</dd>
            </div>
            {hasAssigned && (
              <div className="flex justify-between">
                <dt className="text-zinc-500">Assigned To</dt>
                <dd className="text-zinc-200 font-mono text-xs">{truncateAddress(String(assignedTo))}</dd>
              </div>
            )}
            {task["result-url"] && String(task["result-url"]).length > 0 && (
              <div className="flex justify-between">
                <dt className="text-zinc-500">Result</dt>
                <dd className="text-indigo-400 text-xs truncate max-w-48">{String(task["result-url"])}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">
            Bids ({bids.length})
          </h2>
          {bids.length === 0 ? (
            <p className="text-sm text-zinc-600">No bids yet.</p>
          ) : (
            <div className="space-y-3">
              {bids.map((bid) => (
                <div key={bid.bidder} className="flex items-center justify-between text-sm border-b border-zinc-800/50 pb-2">
                  <span className="text-zinc-400 font-mono text-xs">{truncateAddress(bid.bidder)}</span>
                  <span className="text-indigo-400">{formatStx(BigInt(bid.price))}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
