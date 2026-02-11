"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CurveStatusBadge } from "./curve-status-badge";
import { formatStx, truncateAddress } from "@/lib/format";

interface CurveCardProps {
  id: number;
  name: string;
  symbol: string;
  creator: string;
  stxReserve: string;
  graduated: boolean;
  tradeCount: number;
  graduationStx?: string;
  index: number;
}

export function CurveCard({
  id,
  name,
  symbol,
  creator,
  stxReserve,
  graduated,
  tradeCount,
  graduationStx,
  index,
}: CurveCardProps) {
  const reserve = BigInt(stxReserve);
  const graduation = graduationStx ? BigInt(graduationStx) : null;
  const progress =
    !graduated && graduation && graduation > 0n
      ? Number((reserve * 10000n) / graduation) / 100
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/token/${id}`} className="block">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-zinc-200 truncate text-sm">
              {name}{" "}
              <span className="text-zinc-500 font-normal">${symbol}</span>
            </h3>
            <CurveStatusBadge graduated={graduated} />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>by {truncateAddress(creator)}</span>
            <span className="text-indigo-400 font-medium">
              {formatStx(reserve)} locked
            </span>
          </div>

          <div className="mt-2 flex gap-3 text-[10px] text-zinc-600">
            <span>
              {tradeCount} trade{tradeCount !== 1 ? "s" : ""}
            </span>
          </div>

          {progress !== null && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-zinc-600 mb-1">
                <span>Graduation progress</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
