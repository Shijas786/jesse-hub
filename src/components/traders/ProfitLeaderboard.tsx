'use client';

import { useTraders } from '@/hooks/useTraders';
import { TraderCard } from './TraderCard';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { ErrorFallback } from '../ErrorFallback';

export function ProfitLeaderboard() {
    const { lists, isLoading, isError, error, refetch } = useTraders();

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return <ErrorFallback error={error} resetError={() => refetch()} title="Failed to load traders" />;
    }

    return (
        <div>
            {lists.profit.map((trader, index) => (
                <TraderCard
                    key={trader.address}
                    trader={trader}
                    rank={index + 1}
                    highlight={index === 0 ? 'Top Profit' : undefined}
                />
            ))}
        </div>
    );
}

