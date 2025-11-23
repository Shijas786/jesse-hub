'use client';

import { Mission } from '@/types';
import { useApi } from './useApi';
import { useAccount } from 'wagmi';

interface MissionsResponse {
    missions: Mission[];
}

export function useDailyMissions(addressOverride?: string) {
    const { address } = useAccount();
    const target = (addressOverride ?? address)?.toLowerCase();
    const url = target ? `/api/missions?address=${target}` : '/api/missions';

    const query = useApi<MissionsResponse>(
        ['missions', target ?? 'anon'],
        url,
        target ? undefined : { staleTime: 5 * 60 * 1000 }
    );

    return {
        ...query,
        missions: query.data?.missions ?? [],
    };
}

