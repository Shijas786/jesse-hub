'use client';

import { useHolderLeaderboards } from '@/hooks/useHolderLeaderboards';
import { LeaderboardList } from './LeaderboardList';
import { formatNumber } from '@/utils/format';

export function DiamondHandsLeaderboard() {
    const { leaderboards, isLoading } = useHolderLeaderboards();
    if (isLoading) {
        return <p className="text-white/60">Loading diamond hands…</p>;
    }

    const entries = leaderboards.diamondHands.map((holder, index) => ({
        rank: index + 1,
        address: holder.address,
        value: `${formatNumber(holder.diamondScore ?? 0, 0)} pts`,
        subtitle: holder.diamond ? 'Never sold' : 'Minimal sells',
        farcaster: holder.farcaster ?? undefined,
    }));

    return <LeaderboardList entries={entries} emptyLabel="No diamond hands yet." />;
}

