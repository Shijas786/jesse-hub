'use client';

import { useHolderLeaderboards } from '@/hooks/useHolderLeaderboards';
import { LeaderboardList } from './LeaderboardList';
import { formatUsd } from '@/utils/format';

export function WhaleLeaderboard() {
    const { leaderboards, isLoading } = useHolderLeaderboards();

    if (isLoading) {
        return <p className="text-white/60">Loading whales…</p>;
    }

    const entries = leaderboards.whales.map((holder) => ({
        rank: holder.rank,
        address: holder.address,
        value: formatUsd(holder.balanceQuote ?? 0),
        subtitle: `${holder.balance.toFixed(2)} JESSE`,
        farcaster: holder.farcaster ?? undefined,
    }));

    return <LeaderboardList entries={entries} emptyLabel="No whales detected." />;
}

