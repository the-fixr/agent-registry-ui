export function CapabilityTag({ capability }: { capability: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900/30 text-indigo-300 border border-indigo-500/20">
      {capability}
    </span>
  );
}
