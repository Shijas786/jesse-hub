export type BadgeId = 'og' | 'whale' | 'diamond' | 'streak' | 'scalper' | 'rekt';

export interface BadgeMetadata {
    id: BadgeId;
    label: string;
    description: string;
    icon: string;
    theme: string;
}

export interface FarcasterProfile {
    fid: number;
    username: string;
    displayName: string;
    bio: string;
    avatar: string;
    followerCount: number;
}

export interface HolderSummary {
    address: `0x${string}`;
    balance: number;
    balanceQuote: number;
    percentage: number;
    rank: number;
    whale: boolean;
    diamond: boolean;
    paper: boolean;
    gmStreak: number;
    badges: BadgeId[];
    farcaster?: FarcasterProfile | null;
    firstBuy?: string;
    lastSell?: string;
    totalBuys?: number;
    totalSells?: number;
    daysHeld?: number;
    diamondScore?: number;
    scalperScore?: number;
}

export interface HolderActivityPoint {
    timestamp: string;
    value: number;
}

export interface HolderDetail extends HolderSummary {
    activity: HolderActivityPoint[];
}

export interface Mission {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    completed: boolean;
    requirement: string;
}

export interface TraderTrade {
    hash: string;
    timestamp: string;
    direction: 'buy' | 'sell';
    amount: number;
    value: number;
    price: number;
    holdingHours: number;
}

export interface TraderAnalytics {
    address: `0x${string}`;
    totalBuys: number;
    totalSells: number;
    buyValue: number;
    sellValue: number;
    realizedProfit: number;
    winRate: number;
    scalperScore: number;
    rektScore: number;
    diamondHandScore: number;
    avgEntry: number;
    avgExit: number;
    winStreak: number;
    lossStreak: number;
    trades: TraderTrade[];
    farcaster?: FarcasterProfile | null;
    badges: BadgeId[];
}

export interface JesseStatsResponse {
    totalHolders: number;
    totalSupply: number;
    topHolderPercentage: number;
    circulatingSupply: number;
    treasuryBalance: number;
}

