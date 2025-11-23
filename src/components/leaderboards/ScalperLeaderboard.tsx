'use client';

import { useTraderLeaderboards } from '@/hooks/useTraderLeaderboards';
import { LeaderboardList } from './LeaderboardList';
import { formatUsd } from '@/utils/format';

export function ScalperLeaderboard() {
    const { leaderboards, isLoading } = useTraderLeaderboards();
    if (isLoading) {
        return <p className="text-white/60">Loading scalpers…</p>;
    }

    const entries = leaderboards.scalpers.map((trader, index) => ({
        rank: index + 1,
        address: trader.address,
        value: `${trader.scalperScore} ⚡`,
        subtitle: `PnL ${formatUsd(trader.realizedProfit)}`,
        farcaster: trader.farcaster ?? undefined,
    }));

    return <LeaderboardList entries={entries} emptyLabel="No scalpers found." />;
}

