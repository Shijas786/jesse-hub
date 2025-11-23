'use client';

import { HolderDetail } from '@/types';
import { useApi } from './useApi';

interface HolderResponse {
    holder: HolderDetail;
    realizedProfit: number;
    buyValue: number;
    sellValue: number;
}

const normalize = (address?: string) => address?.toLowerCase() as `0x${string}` | undefined;

export function useHolder(address?: string) {
    const normalized = normalize(address);
    return useApi<HolderResponse>(
        ['holder', normalized ?? ''],
        normalized ? `/api/holders/${normalized}` : '',
        { enabled: Boolean(normalized) }
    );
}

