// Format STX microunits to human-readable
export function formatStx(microStx: bigint | number): string {
  const n = typeof microStx === "bigint" ? microStx : BigInt(microStx);
  const whole = n / 1_000_000n;
  const frac = n % 1_000_000n;
  if (frac === 0n) return `${whole} STX`;
  const fracStr = frac.toString().padStart(6, "0").replace(/0+$/, "");
  return `${whole}.${fracStr} STX`;
}

// Truncate a principal for display
export function truncateAddress(addr: string, chars = 4): string {
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`;
}

// Get agent status label
export function statusLabel(status: number): string {
  switch (status) {
    case 1: return "Active";
    case 2: return "Paused";
    case 3: return "Deregistered";
    default: return "Unknown";
  }
}

// Get task status label
export function taskStatusLabel(status: number): string {
  switch (status) {
    case 1: return "Open";
    case 2: return "Assigned";
    case 3: return "Submitted";
    case 4: return "Completed";
    case 5: return "Disputed";
    case 6: return "Cancelled";
    case 7: return "Expired";
    default: return "Unknown";
  }
}

// Approximate block height to relative time (Stacks ~10min blocks)
export function blocksAgo(currentBlock: number, targetBlock: number): string {
  const diff = currentBlock - targetBlock;
  if (diff < 0) return "future";
  if (diff < 1) return "just now";
  const minutes = diff * 10;
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Format token amounts (default 6 decimals)
export function formatTokenAmount(amount: bigint | number, decimals = 6): string {
  const n = typeof amount === "bigint" ? amount : BigInt(amount);
  const divisor = 10n ** BigInt(decimals);
  const whole = n / divisor;
  const frac = n % divisor;
  if (frac === 0n) return whole.toLocaleString();
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return `${whole.toLocaleString()}.${fracStr}`;
}

// Format price from scaled value (PRICE-SCALE = 10^12)
export function formatPrice(scaledPrice: bigint | number): string {
  const n = typeof scaledPrice === "bigint" ? scaledPrice : BigInt(scaledPrice);
  // scaledPrice is in microSTX * 10^12 / token_units
  // Convert to STX per million tokens for display
  const stxPerMillionTokens = (n * 1_000_000n) / 1_000_000_000_000n;
  return formatStx(stxPerMillionTokens) + "/M tokens";
}

// Graduation progress as percentage
export function graduationProgress(stxReserve: bigint, graduationStx: bigint): number {
  if (graduationStx === 0n) return 100;
  return Math.min(100, Number((stxReserve * 100n) / graduationStx));
}
