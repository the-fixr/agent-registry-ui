import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center gap-1">
            <span>Built by</span>
            <a
              href="https://fixr.nexus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400/80 hover:text-indigo-400 transition-colors"
            >
              Fixr
            </a>
            <span className="text-zinc-700 mx-1">&middot;</span>
            <span>Powered by</span>
            <a
              href="https://www.stacks.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              Stacks
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
              Privacy
            </Link>
            <Link href="/disclaimer" className="hover:text-zinc-400 transition-colors">
              Disclaimer
            </Link>
            <a
              href="https://github.com/the-fixr/agent-registry-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="text-center text-[10px] text-zinc-700 mt-4">
          This is experimental software on testnet. Smart contracts are unaudited. Use at your own risk.
        </p>
      </div>
    </footer>
  );
}
