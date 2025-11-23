'use client';

import { useApi } from './useApi';

interface GMEntry {
    rank: number;
    address: `0x${string}`;
    streak: number;
    lastGm: string;
    farcaster: {
        username: string;
        avatar: string;
        displayName: string;
    } | null;
}

interface GMResponse {
    leaderboard: GMEntry[];
}

export function useGMLeaderboard() {
    const query = useApi<GMResponse>(['leaderboard', 'gm'], '/api/leaderboards/gm');
    return {
        ...query,
        leaderboard: query.data?.leaderboard ?? [],
    };
}

