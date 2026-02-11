export function CurveStatusBadge({ graduated }: { graduated: boolean }) {
  const cls = graduated
    ? "bg-indigo-900/40 text-indigo-400 border-indigo-500/30"
    : "bg-emerald-900/40 text-emerald-400 border-emerald-500/30";
  const label = graduated ? "Graduated" : "Active";

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}
