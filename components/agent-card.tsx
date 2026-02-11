"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { StatusBadge } from "./status-badge";
import { ReputationBadge } from "./reputation-badge";
import { formatStx, truncateAddress } from "@/lib/format";

interface AgentCardProps {
  principal: string;
  name: string;
  status: number;
  pricePerTask: string; // serialized bigint
  reputation: { totalScore: number; ratingCount: number; tasksCompleted: number; endorsementCount: number } | null;
  index: number;
}

export function AgentCard({ principal, name, status, pricePerTask, reputation, index }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/agent/${principal}`} className="block">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-zinc-200 truncate">{name}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-[11px] text-zinc-500 font-mono mb-3">
            {truncateAddress(principal)}
          </p>
          <div className="flex items-center justify-between">
            {reputation ? (
              <ReputationBadge totalScore={reputation.totalScore} ratingCount={reputation.ratingCount} />
            ) : (
              <span className="text-xs text-zinc-600">No ratings</span>
            )}
            <span className="text-[10px] text-zinc-500">
              {formatStx(BigInt(pricePerTask))}/task
            </span>
          </div>
          {reputation && reputation.tasksCompleted > 0 && (
            <div className="mt-2 flex gap-3 text-[10px] text-zinc-600">
              <span>{reputation.tasksCompleted} tasks</span>
              <span>{reputation.endorsementCount} endorsements</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
