'use client';

import { useTraders } from '@/hooks/useTraders';
import { TraderCard } from './TraderCard';

export function ScalpersList() {
    const { lists, isLoading } = useTraders();
    if (isLoading) {
        return <p className="text-white/60">Loading scalpers…</p>;
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

