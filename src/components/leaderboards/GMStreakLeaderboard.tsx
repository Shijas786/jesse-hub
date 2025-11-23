'use client';

import { useGMLeaderboard } from '@/hooks/useGMLeaderboard';
import { LeaderboardList } from './LeaderboardList';

export function GMStreakLeaderboard() {
    const { leaderboard, isLoading } = useGMLeaderboard();

    if (isLoading) {
        return <p className="text-white/60">Loading streaks…</p>;
    }

    const entries = leaderboard.map((entry) => ({
        rank: entry.rank,
        address: entry.address,
        value: `${entry.streak} 🔥`,
        subtitle: new Date(entry.lastGm).toLocaleString(),
        farcaster: entry.farcaster,
    }));

    return <LeaderboardList entries={entries} emptyLabel="No GM activity recorded." />;
}

