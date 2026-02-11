"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TaskStatusBadge } from "./task-status-badge";
import { formatStx, truncateAddress } from "@/lib/format";

interface TaskCardProps {
  id: number;
  title: string;
  poster: string;
  bounty: string; // serialized bigint
  status: number;
  bidCount: number;
  assignedTo: string | null;
  index: number;
}

export function TaskCard({ id, title, poster, bounty, status, bidCount, assignedTo, index }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link href={`/task/${id}`} className="block">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-zinc-200 truncate text-sm">{title}</h3>
            <TaskStatusBadge status={status} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span>by {truncateAddress(poster)}</span>
            <span className="text-indigo-400 font-medium">{formatStx(BigInt(bounty))}</span>
          </div>
          <div className="mt-2 flex gap-3 text-[10px] text-zinc-600">
            <span>{bidCount} bid{bidCount !== 1 ? "s" : ""}</span>
            {assignedTo && <span>assigned to {truncateAddress(assignedTo)}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
