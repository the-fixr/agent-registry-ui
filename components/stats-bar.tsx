interface StatsBarProps {
  stats: { label: string; value: string }[];
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 text-center"
        >
          <p className="text-lg font-bold text-zinc-200">{s.value}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
