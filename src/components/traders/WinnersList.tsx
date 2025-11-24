'use client';

import { useTraders } from '@/hooks/useTraders';
import { TraderCard } from './TraderCard';
import { formatUsd } from '@/utils/format';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { ErrorFallback } from '../ErrorFallback';

export function WinnersList() {
    const { lists, isLoading, isError, error, refetch } = useTraders();
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return <ErrorFallback error={error} resetError={() => refetch()} title="Failed to load winners" />;
    }

    return (
        <div>
            {lists.winners.map((trader, index) => (
                <TraderCard
                    key={trader.address}
                    trader={trader}
                    rank={index + 1}
                    highlight={`+${formatUsd(trader.realizedProfit)}`}
                />
            ))}
        </div>
    );
}

