'use client';

import { useTraderLeaderboards } from '@/hooks/useTraderLeaderboards';
import { LeaderboardList } from './LeaderboardList';
import { formatUsd } from '@/utils/format';

export function RektLeaderboard() {
    const { leaderboards, isLoading } = useTraderLeaderboards();
    if (isLoading) {
        return <p className="text-white/60">Loading rekt board…</p>;
    }

    const entries = leaderboards.rekt.map((trader, index) => ({
        rank: index + 1,
        address: trader.address,
        value: formatUsd(trader.realizedProfit),
        subtitle: `${trader.totalSells} sells`,
        farcaster: trader.farcaster ?? undefined,
    }));

    return <LeaderboardList entries={entries} emptyLabel="No rekt traders yet." />;
}

