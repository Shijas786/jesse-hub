'use client';

import { useHolderLeaderboards } from '@/hooks/useHolderLeaderboards';
import { LeaderboardList } from './LeaderboardList';
import { formatNumber, formatPercentage } from '@/utils/format';

export function TopHoldersLeaderboard() {
    const { leaderboards, isLoading } = useHolderLeaderboards();
    if (isLoading) {
        return <p className="text-white/60">Loading holders…</p>;
    }

    const entries = leaderboards.top.map((holder) => ({
        rank: holder.rank,
        address: holder.address,
        value: `${formatNumber(holder.balance, 2)} JESSE`,
        subtitle: `${formatPercentage(holder.percentage ?? 0)} of supply`,
        farcaster: holder.farcaster ?? undefined,
    }));

    return <LeaderboardList entries={entries} emptyLabel="No holders found." />;
}

