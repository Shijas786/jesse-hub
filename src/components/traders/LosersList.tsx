'use client';

import { useTraders } from '@/hooks/useTraders';
import { TraderCard } from './TraderCard';
import { formatUsd } from '@/utils/format';

export function LosersList() {
    const { lists, isLoading } = useTraders();
    if (isLoading) {
        return <p className="text-white/60">Loading rekt board…</p>;
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

