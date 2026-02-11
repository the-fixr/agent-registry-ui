import { notFound } from "next/navigation";
import Link from "next/link";
import { getAgent, getReputation, getAverageScore, getCapability, getVault, getAgentCurve, getCurve, getCurvePrice } from "@/lib/stacks-api";
import { parseTuple, unwrapOptional } from "@/lib/decoder";
import { StatusBadge } from "@/components/status-badge";
import { ReputationBadge } from "@/components/reputation-badge";
import { CapabilityTag } from "@/components/capability-tag";
import { CurveStatusBadge } from "@/components/curve-status-badge";
import { formatStx, formatTokenAmount, formatPrice, graduationProgress } from "@/lib/format";

export const revalidate = 60;

export default async function AgentDetailPage({ params }: { params: Promise<{ principal: string }> }) {
  const { principal } = await params;
  const decoded = decodeURIComponent(principal);

  const [agentRaw, repRaw, avgRaw, vaultRaw, agentCurveRaw] = await Promise.all([
    getAgent(decoded),
    getReputation(decoded),
    getAverageScore(decoded),
    getVault(decoded),
    getAgentCurve(decoded),
  ]);

  const agentOpt = unwrapOptional(agentRaw);
  if (!agentOpt) return notFound();

  const agent = parseTuple(agentOpt);
  const rep = repRaw ? parseTuple(unwrapOptional(repRaw)) : null;
  const avg = avgRaw ? unwrapOptional(avgRaw) : null;
  const vault = vaultRaw ? parseTuple(unwrapOptional(vaultRaw)) : null;

  // Fetch bonding curve if agent has one
  const agentCurveOpt = agentCurveRaw ? parseTuple(unwrapOptional(agentCurveRaw)) : null;
  let curve: Record<string, unknown> | null = null;
  let curveId: number | null = null;
  let curvePrice: bigint | null = null;
  if (agentCurveOpt && agentCurveOpt["curve-id"] != null) {
    curveId = Number(agentCurveOpt["curve-id"]);
    const [curveRaw, priceRaw] = await Promise.all([
      getCurve(curveId),
      getCurvePrice(curveId),
    ]);
    const curveOpt = curveRaw ? unwrapOptional(curveRaw) : null;
    if (curveOpt) curve = parseTuple(curveOpt);
    const priceOpt = priceRaw ? unwrapOptional(priceRaw) : null;
    if (priceOpt) {
      const v = priceOpt?.value;
      curvePrice = BigInt(typeof v === "object" && v?.value != null ? v.value : v ?? 0);
    }
  }

  // Fetch capabilities (0-7)
  const capPromises = Array.from({ length: 8 }, (_, i) => getCapability(decoded, i));
  const capResults = await Promise.all(capPromises);
  const capabilities: string[] = [];
  for (const c of capResults) {
    const opt = unwrapOptional(c);
    if (opt) {
      const t = parseTuple(opt);
      if (t.capability) capabilities.push(String(t.capability));
    }
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-zinc-100">{String(agent.name || "Agent")}</h1>
          <StatusBadge status={Number(agent.status || 1)} />
        </div>
        <p className="text-xs text-zinc-500 font-mono">{decoded}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Profile</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-zinc-500">Price per Task</dt>
              <dd className="text-zinc-200">{formatStx(BigInt(agent["price-per-task"] || 0))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Accepts STX</dt>
              <dd className="text-zinc-200">{agent["accepts-stx"] ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Accepts SIP-010</dt>
              <dd className="text-zinc-200">{agent["accepts-sip010"] ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Total Tasks</dt>
              <dd className="text-zinc-200">{String(agent["total-tasks"] || 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500">Total Earned</dt>
              <dd className="text-zinc-200">{formatStx(BigInt(agent["total-earned"] || 0))}</dd>
            </div>
          </dl>
        </div>

        {/* Reputation */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Reputation</h2>
          {rep ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <dt className="text-zinc-500">Rating</dt>
                <dd>
                  <ReputationBadge
                    totalScore={Number(rep["total-score"] || 0)}
                    ratingCount={Number(rep["rating-count"] || 0)}
                  />
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Tasks Completed</dt>
                <dd className="text-zinc-200">{String(rep["tasks-completed"] || 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Tasks Disputed</dt>
                <dd className="text-zinc-200">{String(rep["tasks-disputed"] || 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Endorsements</dt>
                <dd className="text-zinc-200">{String(rep["endorsement-count"] || 0)}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-zinc-600">No reputation data yet.</p>
          )}
        </div>

        {/* Capabilities */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Capabilities</h2>
          {capabilities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap) => (
                <CapabilityTag key={cap} capability={cap} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-600">No capabilities set.</p>
          )}
        </div>

        {/* Vault */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Vault</h2>
          {vault ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Balance</dt>
                <dd className="text-zinc-200">{formatStx(BigInt(vault.balance || 0))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Per-Tx Cap</dt>
                <dd className="text-zinc-200">{formatStx(BigInt(vault["per-tx-cap"] || 0))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Daily Cap</dt>
                <dd className="text-zinc-200">{formatStx(BigInt(vault["daily-cap"] || 0))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Whitelist Only</dt>
                <dd className="text-zinc-200">{vault["whitelist-only"] ? "Yes" : "No"}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-zinc-600">No vault created.</p>
          )}
        </div>
      </div>

      {/* Bonding Curve - full width below the grid */}
      {curve && curveId != null && (
        <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Bonding Curve</h2>
            <CurveStatusBadge graduated={curve.graduated === true || curve.graduated === "true"} />
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xl font-bold text-zinc-100">
              {String(curve.name || "Token")}
            </span>
            <span className="text-sm text-zinc-500">${String(curve.symbol || "???")}</span>
          </div>

          {/* Curve stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-200">{formatStx(BigInt(curve["stx-reserve"] as string || "0"))}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">STX Reserve</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-200">{formatTokenAmount(BigInt(curve["tokens-sold"] as string || "0"))}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Tokens Sold</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-zinc-200">{formatStx(BigInt(curve["accrued-fees"] as string || "0"))}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Accrued Fees</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-indigo-400">
                {curvePrice ? formatPrice(curvePrice) : "N/A"}
              </p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Current Price</p>
            </div>
          </div>

          {/* Graduation progress */}
          {!(curve.graduated === true || curve.graduated === "true") && BigInt(curve["graduation-stx"] as string || "0") > 0n && (() => {
            const stxReserve = BigInt(curve["stx-reserve"] as string || "0");
            const graduationStx = BigInt(curve["graduation-stx"] as string || "0");
            const progress = graduationProgress(stxReserve, graduationStx);
            return (
              <div className="mb-5">
                <div className="flex items-center justify-between text-sm text-zinc-500 mb-2">
                  <span>Graduation: {formatStx(stxReserve)} / {formatStx(graduationStx)}</span>
                  <span className="text-zinc-300 font-medium">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            );
          })()}

          <Link
            href={`/token/${curveId}`}
            className="inline-block text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View full token details &rarr;
          </Link>
        </div>
      )}
    </>
  );
}
