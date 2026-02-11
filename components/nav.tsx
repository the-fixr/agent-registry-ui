"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Registry" },
  { href: "/tasks", label: "Tasks" },
  { href: "/launchpad", label: "Launchpad" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/docs", label: "Docs" },
];

function StacksLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <path d="M3 16.5L7.5 12L3 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 16.5L16.5 12L21 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 4H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
          <span className="text-indigo-400"><StacksLogo /></span>
          <span className="text-indigo-400">Agent</span>{" "}
          <span className="text-zinc-300">Registry</span>
        </Link>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? "text-indigo-400"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-500/30">
            testnet
          </span>
        </div>
      </div>
    </nav>
  );
}
