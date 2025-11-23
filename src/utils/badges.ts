import { BadgeId, BadgeMetadata } from '@/types';

export const BADGE_REGISTRY: Record<BadgeId, BadgeMetadata> = {
    og: {
        id: 'og',
        label: 'OG Jesse',
        description: 'Holding for 30+ days',
        icon: '🗝️',
        theme: 'from-cyan-400 to-blue-500',
    },
    whale: {
        id: 'whale',
        label: 'Whale',
        description: 'Top 1% holder',
        icon: '🐋',
        theme: 'from-blue-400 to-purple-500',
    },
    diamond: {
        id: 'diamond',
        label: 'Diamond Hands',
        description: 'Zero sells on record',
        icon: '💎',
        theme: 'from-teal-400 to-emerald-500',
    },
    streak: {
        id: 'streak',
        label: 'Streak God',
        description: 'GM streak above 15',
        icon: '🔥',
        theme: 'from-amber-400 to-orange-500',
    },
    scalper: {
        id: 'scalper',
        label: 'Scalper',
        description: 'Executed more than 5 trades',
        icon: '⚡',
        theme: 'from-pink-400 to-red-500',
    },
    rekt: {
        id: 'rekt',
        label: 'Rekt Survivor',
        description: 'Down more than $100',
        icon: '☠️',
        theme: 'from-gray-400 to-slate-600',
    },
};

interface BadgeInput {
    daysHeld?: number;
    rank?: number;
    hasSold?: boolean;
    gmStreak?: number;
    tradeCount?: number;
    realizedProfit?: number;
    balanceQuote?: number;
}

export function deriveBadges(input: BadgeInput): BadgeId[] {
    const badges: BadgeId[] = [];

    if ((input.daysHeld ?? 0) >= 30) {
        badges.push('og');
    }

    if (input.rank && input.rank <= 1) {
        badges.push('whale');
    }

    if (input.hasSold === false) {
        badges.push('diamond');
    }

    if ((input.gmStreak ?? 0) > 15) {
        badges.push('streak');
    }

    if ((input.tradeCount ?? 0) > 5) {
        badges.push('scalper');
    }

    if ((input.realizedProfit ?? 0) < -100) {
        badges.push('rekt');
    }

    return badges;
}

