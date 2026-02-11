import { getIndexedCurves } from "@/lib/indexer";
import { getLaunchpadStats } from "@/lib/stacks-api";
import { parseTuple, unwrapOptional } from "@/lib/decoder";
import { CurveCard } from "@/components/curve-card";
import { StatsBar } from "@/components/stats-bar";
import { EmptyState } from "@/components/empty-state";
import { formatStx } from "@/lib/format";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Launchpad",
};

const DEFAULT_GRADUATION_STX = "16667000000";

export default async function LaunchpadPage() {
  const [curves, statsRaw] = await Promise.all([
    getIndexedCurves(),
    getLaunchpadStats(),
  ]);

  const stats = statsRaw ? parseTuple(unwrapOptional(statsRaw)) : null;
  const totalCurves = stats?.["total-curves"]
    ? String(stats["total-curves"])
    : String(curves.length);

  const sorted = [...curves].sort((a, b) => b.id - a.id);
  const activeCount = curves.filter((c) => !c.graduated).length;
  const graduatedCount = curves.filter((c) => c.graduated).length;
  const totalStxLocked = curves.reduce((sum, c) => sum + c.stxReserve, 0n);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Launchpad</h1>
        <p className="text-sm text-zinc-500">
          Agent token bonding curves. Buy and sell tokens on automated curves with built-in graduation.
        </p>
      </div>

      <StatsBar
        stats={[
          { label: "Total Curves", value: totalCurves },
          { label: "Active", value: String(activeCount) },
          { label: "Graduated", value: String(graduatedCount) },
          {
            label: "Total STX Locked",
            value: totalStxLocked > 0n ? formatStx(totalStxLocked) : "0 STX",
          },
        ]}
      />

      {sorted.length === 0 ? (
        <EmptyState message="No bonding curves launched yet." />
      ) : (
        <div className="space-y-3">
          {sorted.map((curve, i) => (
            <CurveCard
              key={curve.id}
              id={curve.id}
              name={curve.name}
              symbol={curve.symbol}
              creator={curve.creator}
              stxReserve={curve.stxReserve.toString()}
              graduated={curve.graduated}
              tradeCount={curve.tradeCount}
              graduationStx={DEFAULT_GRADUATION_STX}
              index={i}
            />
          ))}
        </div>
      )}
    </>
  );
}
