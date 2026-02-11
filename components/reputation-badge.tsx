export function ReputationBadge({
  totalScore,
  ratingCount,
}: {
  totalScore: number;
  ratingCount: number;
}) {
  if (ratingCount === 0) {
    return <span className="text-xs text-zinc-600">No ratings</span>;
  }
  const avg = totalScore / ratingCount;
  const stars = Math.round(avg);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            className={`text-xs ${i <= stars ? "text-yellow-400" : "text-zinc-700"}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-[10px] text-zinc-500">
        {avg.toFixed(1)} ({ratingCount})
      </span>
    </div>
  );
}
