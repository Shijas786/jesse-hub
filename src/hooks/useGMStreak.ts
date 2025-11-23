'use client';

import { useAccount, useReadContract } from 'wagmi';
import JesseGMAbi from '@/lib/abis/JesseGM.json';

const gmAddress = process.env.NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS as `0x${string}` | undefined;

const normalize = (address?: string | null) => address?.toLowerCase() as `0x${string}` | undefined;

export function useGMStreak(addressOverride?: string) {
    const { address } = useAccount();
    const target = normalize(addressOverride ?? address);
    const enabled = Boolean(target && gmAddress);

    const streakQuery = useReadContract({
        abi: JesseGMAbi,
        address: gmAddress,
        functionName: 'streak',
        args: target ? [target] : undefined,
        query: { enabled },
    });

    const lastGmQuery = useReadContract({
        abi: JesseGMAbi,
        address: gmAddress,
        functionName: 'lastGm',
        args: target ? [target] : undefined,
        query: { enabled },
    });

    return {
        streak: Number(streakQuery.data ?? 0),
        lastGm: lastGmQuery.data ? Number(lastGmQuery.data) * 1000 : null,
        refetch: streakQuery.refetch,
        isFetching: streakQuery.isFetching || lastGmQuery.isFetching,
    };
}

