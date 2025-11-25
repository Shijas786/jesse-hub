'use client';

import { useTraders } from '@/hooks/useTraders';
import { TraderCard } from './TraderCard';
import { formatUsd } from '@/utils/format';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { ErrorFallback } from '../ErrorFallback';

export function LosersList() {
    const { lists, isLoading, isError, error, refetch } = useTraders();
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return <ErrorFallback error={error} resetError={() => refetch()} title="Failed to load rekt board" />;
    }

    return (
        <div>
            {lists.losers.map((trader, index) => (
                <TraderCard
                    key={trader.address}
                    trader={trader}
                    rank={index + 1}
                    highlight={formatUsd(trader.realizedProfit)}
                />
            ))}
        </div>
    );
}

