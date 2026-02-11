export function TaskStatusBadge({ status }: { status: number }) {
  const config: Record<number, { label: string; cls: string }> = {
    1: { label: "Open", cls: "bg-indigo-900/40 text-indigo-400 border-indigo-500/30" },
    2: { label: "Assigned", cls: "bg-blue-900/40 text-blue-400 border-blue-500/30" },
    3: { label: "Submitted", cls: "bg-purple-900/40 text-purple-400 border-purple-500/30" },
    4: { label: "Completed", cls: "bg-emerald-900/40 text-emerald-400 border-emerald-500/30" },
    5: { label: "Disputed", cls: "bg-red-900/40 text-red-400 border-red-500/30" },
    6: { label: "Cancelled", cls: "bg-zinc-800/60 text-zinc-500 border-zinc-600/30" },
    7: { label: "Expired", cls: "bg-zinc-800/60 text-zinc-500 border-zinc-600/30" },
  };
  const c = config[status] || { label: "Unknown", cls: "bg-zinc-800 text-zinc-400 border-zinc-600" };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${c.cls}`}>
      {c.label}
    </span>
  );
}
