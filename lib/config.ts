export const DEPLOYER = "ST356P5YEXBJC1ZANBWBNR0N0X7NT8AV7FZ017K55";
export const HIRO_API = process.env.NEXT_PUBLIC_HIRO_API || "https://api.testnet.hiro.so";

export const CONTRACTS = {
  registry: `${DEPLOYER}.agent-registry`,
  vault: `${DEPLOYER}.agent-vault`,
  taskBoard: `${DEPLOYER}.task-board`,
  reputation: `${DEPLOYER}.reputation`,
  launchpad: `${DEPLOYER}.agent-launchpad`,
  curveRouter: `${DEPLOYER}.x402-curve-router-v2`,
} as const;

export const CACHE_TTL_MS = 60_000;
