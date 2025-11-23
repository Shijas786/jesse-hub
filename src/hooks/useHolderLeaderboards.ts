'use client';

import { HolderSummary } from '@/types';
import { useApi } from './useApi';

interface HolderLeaderboardResponse {
    top: HolderSummary[];
    whales: HolderSummary[];
    diamonds: HolderSummary[];
    diamondHands: HolderSummary[];
    paperHands: HolderSummary[];
}

export function useHolderLeaderboards() {
    const query = useApi<HolderLeaderboardResponse>(['leaderboard', 'holders'], '/api/leaderboards/holders');
    return {
        ...query,
        leaderboards: query.data ?? {
            top: [],
            whales: [],
            diamonds: [],
            diamondHands: [],
            paperHands: [],
        },
    };
}

