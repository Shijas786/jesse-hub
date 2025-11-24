'use client';

import { useTraders } from '@/hooks/useTraders';
import { TraderCard } from './TraderCard';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { ErrorFallback } from '../ErrorFallback';

export function ScalpersList() {
    const { lists, isLoading, isError, error, refetch } = useTraders();
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return <ErrorFallback error={error} resetError={() => refetch()} title="Failed to load scalpers" />;
    }

    return (
        <div>
            {lists.scalpers.map((trader, index) => (
                <TraderCard
                    key={trader.address}
                    trader={trader}
                    rank={index + 1}
                    highlight={`${trader.scalperScore} ⚡`}
                />
            ))}
        </div>
    );
}

