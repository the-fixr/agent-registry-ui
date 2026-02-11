import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurve, getCurvePrice } from "@/lib/stacks-api";
import { parseTuple, unwrapOptional } from "@/lib/decoder";
import {
  formatStx,
  formatTokenAmount,
  formatPrice,
  graduationProgress,
  truncateAddress,
} from "@/lib/format";
import { CurveStatusBadge } from "@/components/curve-status-badge";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const curveId = parseInt(id, 10);
  if (isNaN(curveId)) return { title: "Token" };

  const curveRaw = await getCurve(curveId);
  const curveOpt = unwrapOptional(curveRaw);
  if (!curveOpt) return { title: "Token" };

  const curve = parseTuple(curveOpt);
  return { title: String(curve.name || "Token") };
}

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const curveId = parseInt(id, 10);
  if (isNaN(curveId)) return notFound();

  const curveRaw = await getCurve(curveId);
  const curveOpt = unwrapOptional(curveRaw);
  if (!curveOpt) return notFound();

  const curve = parseTuple(curveOpt);

  // Fetch current price
  const priceRaw = await getCurvePrice(curveId);
  const priceOpt = priceRaw ? unwrapOptional(priceRaw) : null;
  const price = priceOpt ? (() => {
    const v = priceOpt?.value;
    return BigInt(typeof v === "object" && v?.value != null ? v.value : v ?? 0);
  })() : null;

  const name = String(curve.name || `Token #${curveId}`);
  const symbol = String(curve.symbol || "???");
  const creator = String(curve.creator || "");
  const stxReserve = BigInt(curve["stx-reserve"] || 0);
  const tokensSold = BigInt(curve["tokens-sold"] || 0);
  const totalSupply = BigInt(curve["total-supply"] || 0);
  const feeBps = Number(curve["fee-bps"] || 0);
  const accruedFees = BigInt(curve["accrued-fees"] || 0);
  const graduated = curve.graduated === true || curve.graduated === "true";
  const graduationStx = BigInt(curve["graduation-stx"] || 0);
  const progress = graduationProgress(stxReserve, graduationStx);

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-zinc-100">
            {name}{" "}
            <span className="text-zinc-500 font-normal">${symbol}</span>
          </h1>
          <CurveStatusBadge graduated={graduated} />
        </div>
        <p className="text-xs text-zinc-500">
          Created by{" "}
          <Link
            href={`/agent/${encodeURIComponent(creator)}`}
            className="font-mono text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {truncateAddress(creator)}
          </Link>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
          <p className="text-lg font-bold text-zinc-200">{formatStx(stxReserve)}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">STX Reserve</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
          <p className="text-lg font-bold text-zinc-200">
            {formatTokenAmount(tokensSold)} / {formatTokenAmount(totalSupply)}
          </p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Tokens Sold / Supply</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
          <p className="text-lg font-bold text-zinc-200">{(feeBps / 100).toFixed(0)}%</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Fee</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-center">
          <p className="text-lg font-bold text-zinc-200">{formatStx(accruedFees)}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Accrued Fees</p>
        </div>
      </div>

      {/* Graduation Progress */}
      {!graduated && graduationStx > 0n && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 mb-8">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">
            Graduation Progress
          </h2>
          <div className="flex items-center justify-between text-sm text-zinc-500 mb-2">
            <span>{formatStx(stxReserve)} / {formatStx(graduationStx)}</span>
            <span className="text-zinc-300 font-medium">{progress.toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Price */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5 mb-8">
        <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">
          Current Price
        </h2>
        {price !== null ? (
          <p className="text-xl font-bold text-indigo-400">{formatPrice(price)}</p>
        ) : (
          <p className="text-sm text-zinc-600">Price unavailable.</p>
        )}
      </div>

      {/* Trading note */}
      <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/30 p-5">
        <p className="text-sm text-zinc-500">
          Trading UI coming soon. Connect your wallet to buy and sell tokens.
        </p>
      </div>
    </>
  );
}
