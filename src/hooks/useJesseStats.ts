'use client';

import { HolderSummary, JesseStatsResponse } from '@/types';
import { useApi } from './useApi';

interface HoldersResponse {
    holders: HolderSummary[];
    stats: JesseStatsResponse;
}

export function useJesseStats() {
    const query = useApi<HoldersResponse>(['holders', 'summary'], '/api/holders', {
        retry: 1,
        retryDelay: 2000,
    });
    const stats = query.data?.stats;
    return {
        ...query,
        totalHolders: stats?.totalHolders ?? 0,
        totalSupply: stats?.totalSupply ?? 0,
        topHolder: stats?.topHolderPercentage ?? 0,
        holders: query.data?.holders ?? [],
    };
}

