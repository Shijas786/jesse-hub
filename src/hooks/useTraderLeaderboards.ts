'use client';

import { TraderAnalytics } from '@/types';
import { useApi } from './useApi';

interface TraderLeaderboardsResponse {
    profit: TraderAnalytics[];
    scalpers: TraderAnalytics[];
    rekt: TraderAnalytics[];
    whales: TraderAnalytics[];
}

export function useTraderLeaderboards() {
    const query = useApi<TraderLeaderboardsResponse>(['leaderboard', 'traders'], '/api/leaderboards/traders');
    return {
        ...query,
        leaderboards: query.data ?? {
            profit: [],
            scalpers: [],
            rekt: [],
            whales: [],
        },
    };
}

