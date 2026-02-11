export function StatusBadge({ status }: { status: number }) {
  const config: Record<number, { label: string; cls: string }> = {
    1: { label: "Active", cls: "bg-emerald-900/40 text-emerald-400 border-emerald-500/30" },
    2: { label: "Paused", cls: "bg-yellow-900/40 text-yellow-400 border-yellow-500/30" },
    3: { label: "Deregistered", cls: "bg-red-900/40 text-red-400 border-red-500/30" },
  };
  const c = config[status] || { label: "Unknown", cls: "bg-zinc-800 text-zinc-400 border-zinc-600" };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${c.cls}`}>
      {c.label}
    </span>
  );
}
