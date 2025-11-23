'use client';

import { HolderSummary } from '@/types';
import { useJesseStats } from './useJesseStats';

type FilterType = 'all' | 'whales' | 'ogs' | 'diamond' | 'paper';

export function useHolders(filter: FilterType) {
    const query = useJesseStats();
    const holders = query.holders;

    const filtered: HolderSummary[] = holders.filter((holder) => {
        switch (filter) {
            case 'whales':
                return holder.whale;
            case 'ogs':
                return holder.badges?.includes('og');
            case 'diamond':
                return holder.diamond;
            case 'paper':
                return holder.paper;
            default:
                return true;
        }
    });

    return {
        ...query,
        filteredHolders: filtered,
    };
}

