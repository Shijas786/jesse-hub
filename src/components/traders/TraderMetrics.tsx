'use client';

import { useMemo } from 'react';
import { useTraderAnalytics } from '@/hooks/useTraderAnalytics';
import { MetricTile } from '../shared/MetricTile';
import { formatUsd, formatNumber } from '@/utils/format';

interface TraderMetricsProps {
    address: string;
}

export function TraderMetrics({ address }: TraderMetricsProps) {
    const { data, isLoading } = useTraderAnalytics(address);

    const derived = useMemo(() => {
        if (!data) return null;
        const { analytics } = data;
        const sells = analytics.trades.filter((trade) => trade.direction === 'sell');
        const avgEntry = analytics.avgEntry || 0;
        let largestWin = 0;
        let largestLoss = 0;
        let totalHolding = 0;

        sells.forEach((trade) => {
            const pnl = (trade.price - avgEntry) * trade.amount;
            if (pnl > largestWin) largestWin = pnl;
            if (pnl < largestLoss) largestLoss = pnl;
            totalHolding += trade.holdingHours;
        });

        const avgHold = sells.length ? totalHolding / sells.length : 0;

        return { largestWin, largestLoss, avgHold };
    }, [data]);

    if (isLoading || !data || !derived) {
        return (
            <div className="grid grid-cols-3 gap-3 mt-6 animate-pulse">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="glass-card h-20" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-3 mt-6">
            <MetricTile label="Largest Win" value={formatUsd(derived.largestWin)} />
            <MetricTile label="Largest Loss" value={formatUsd(derived.largestLoss)} />
            <MetricTile label="Avg Hold" value={`${formatNumber(derived.avgHold, 1)}h`} />
        </div>
    );
}

