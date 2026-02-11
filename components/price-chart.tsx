"use client";

interface PriceChartProps {
  virtualStx: bigint;
  totalSupply: bigint;
  tokensSold: bigint;
  stxReserve: bigint;
}

const SAMPLES = 30;

export function PriceChart({
  virtualStx,
  totalSupply,
  tokensSold,
  stxReserve,
}: PriceChartProps) {
  // Constant-product bonding curve:
  // price(sold) = (virtualStx + reserveAtSold) / (totalSupply - sold)
  // reserveAtSold scales proportionally with sold.
  // For visualization we compute price at each sample point.

  if (totalSupply === 0n) return null;

  const prices: number[] = [];

  for (let i = 0; i <= SAMPLES; i++) {
    // sold goes from 0 to totalSupply (exclusive of totalSupply to avoid div/0)
    const sold = (totalSupply * BigInt(i)) / BigInt(SAMPLES + 1);
    const remaining = totalSupply - sold;
    if (remaining <= 0n) continue;

    // reserve at this point scales linearly: (stxReserve * sold) / tokensSold
    // but if tokensSold is 0, reserve is 0
    const reserveAtPoint =
      tokensSold > 0n ? (stxReserve * sold) / tokensSold : 0n;

    // price = (virtualStx + reserveAtPoint) / remaining (in micro-units)
    const priceNum =
      Number(virtualStx + reserveAtPoint) / Number(remaining);
    prices.push(priceNum);
  }

  if (prices.length < 2) return null;

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // SVG dimensions and padding
  const W = 300;
  const H = 120;
  const PAD_X = 4;
  const PAD_Y = 8;
  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_Y * 2;

  // Build polyline points
  const points = prices.map((p, i) => {
    const x = PAD_X + (i / (prices.length - 1)) * plotW;
    const y = PAD_Y + plotH - ((p - minPrice) / priceRange) * plotH;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  // Current position dot
  const currentRatio =
    totalSupply > 0n ? Number(tokensSold) / Number(totalSupply) : 0;
  // Map to sample index space
  const currentSampleIdx = currentRatio * SAMPLES;
  // Interpolate price at current position
  const lowerIdx = Math.floor(currentSampleIdx);
  const upperIdx = Math.min(lowerIdx + 1, prices.length - 1);
  const frac = currentSampleIdx - lowerIdx;
  const currentPrice =
    prices[lowerIdx] + (prices[upperIdx] - prices[lowerIdx]) * frac;

  const dotX = PAD_X + (currentSampleIdx / (prices.length - 1)) * plotW;
  const dotY =
    PAD_Y + plotH - ((currentPrice - minPrice) / priceRange) * plotH;

  // Grid lines (3 horizontal)
  const gridLines = [0.25, 0.5, 0.75].map((ratio) => {
    const y = PAD_Y + plotH - ratio * plotH;
    return y;
  });

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 120 }}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {gridLines.map((y, i) => (
          <line
            key={i}
            x1={PAD_X}
            y1={y}
            x2={W - PAD_X}
            y2={y}
            stroke="#27272a"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Curve fill */}
        <polygon
          points={`${PAD_X.toFixed(1)},${(PAD_Y + plotH).toFixed(1)} ${points.join(" ")} ${(W - PAD_X).toFixed(1)},${(PAD_Y + plotH).toFixed(1)}`}
          fill="url(#curveFill)"
          opacity="0.15"
        />

        {/* Curve line */}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#818cf8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current position dot */}
        <circle
          cx={dotX}
          cy={dotY}
          r="4"
          fill="#818cf8"
          stroke="#1e1e24"
          strokeWidth="2"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
