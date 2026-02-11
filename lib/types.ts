// Agent statuses
export const AGENT_STATUS = { ACTIVE: 1, PAUSED: 2, DEREGISTERED: 3 } as const;

// Task statuses
export const TASK_STATUS = { OPEN: 1, ASSIGNED: 2, SUBMITTED: 3, COMPLETED: 4, DISPUTED: 5, CANCELLED: 6, EXPIRED: 7 } as const;

export interface AgentRecord {
  principal: string;
  name: string;
  descriptionUrl: string;
  status: number;
  registeredAt: number;
  totalTasks: number;
  totalEarned: bigint;
  pricePerTask: bigint;
  acceptsStx: boolean;
  acceptsSip010: boolean;
}

export interface ReputationRecord {
  totalScore: number;
  ratingCount: number;
  tasksCompleted: number;
  tasksDisputed: number;
  endorsementCount: number;
}

export interface TaskRecord {
  id: number;
  poster: string;
  title: string;
  descriptionUrl: string;
  bounty: bigint;
  fee: bigint;
  assignedTo: string | null;
  status: number;
  createdAt: number;
  deadline: number;
  submittedAt: number;
  completedAt: number;
  resultUrl: string;
}

export interface BidRecord {
  price: bigint;
  messageUrl: string;
  bidAt: number;
}

export interface VaultRecord {
  balance: bigint;
  perTxCap: bigint;
  dailyCap: bigint;
  dailySpent: bigint;
  lastResetBlock: number;
  whitelistOnly: boolean;
  createdAt: number;
}

export interface IndexedAgent {
  principal: string;
  name: string;
  status: number;
  registeredAt: number;
  pricePerTask: bigint;
  reputation: ReputationRecord | null;
  hasVault: boolean;
}

export interface IndexedTask {
  id: number;
  poster: string;
  title: string;
  bounty: bigint;
  status: number;
  createdAt: number;
  deadline: number;
  assignedTo: string | null;
  bidCount: number;
}

// Curve statuses
export const CURVE_STATUS = { ACTIVE: 1, GRADUATED: 2 } as const;

export interface CurveRecord {
  id: number;
  creator: string;
  name: string;
  symbol: string;
  totalSupply: bigint;
  virtualStx: bigint;
  stxReserve: bigint;
  tokensSold: bigint;
  graduationStx: bigint;
  feeBps: number;
  accruedFees: bigint;
  graduated: boolean;
  createdAt: number;
  creatorShareBps: number;
}

export interface IndexedCurve {
  id: number;
  creator: string;
  name: string;
  symbol: string;
  stxReserve: bigint;
  tokensSold: bigint;
  graduated: boolean;
  createdAt: number;
  tradeCount: number;
}
