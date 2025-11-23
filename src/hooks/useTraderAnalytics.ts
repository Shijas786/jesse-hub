'use client';

import { TraderAnalytics } from '@/types';
import { useApi } from './useApi';

interface TraderResponse {
    analytics: TraderAnalytics;
}

export function useTraderAnalytics(address?: string) {
    const normalized = address?.toLowerCase() as `0x${string}` | undefined;
    return useApi<TraderResponse>(
        ['trader', normalized ?? ''],
        normalized ? `/api/traders/${normalized}` : '',
        { enabled: Boolean(normalized) }
    );
}

