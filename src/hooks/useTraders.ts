'use client';

import { TraderAnalytics } from '@/types';
import { useApi } from './useApi';

interface TradersResponse {
    profit: TraderAnalytics[];
    scalpers: TraderAnalytics[];
    winners: TraderAnalytics[];
    losers: TraderAnalytics[];
}

export function useTraders() {
    const query = useApi<TradersResponse>(['traders'], '/api/traders');
    return {
        ...query,
        lists: query.data ?? {
            profit: [],
            scalpers: [],
            winners: [],
            losers: [],
        },
    };
}

