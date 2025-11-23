'use client';

import { useTraders } from '@/hooks/useTraders';
import { TraderCard } from './TraderCard';
import { LoadingSkeleton } from '../LoadingSkeleton';

export function ProfitLeaderboard() {
    const { lists, isLoading } = useTraders();

    if (isLoading) {
        return <LoadingSkeleton />;
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

