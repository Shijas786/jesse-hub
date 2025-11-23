'use client';

import { useTraderAnalytics } from '@/hooks/useTraderAnalytics';
import { MetricTile } from '../shared/MetricTile';
import { formatNumber, formatUsd } from '@/utils/format';

interface TraderStatsProps {
    address: string;
}

export function TraderStats({ address }: TraderStatsProps) {
    const { data, isLoading } = useTraderAnalytics(address);

    if (isLoading || !data) {
        return (
            <div className="grid grid-cols-2 gap-3 animate-pulse mt-6">
                {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="glass-card h-24" />
                ))}
            </div>
        );
    }

    const trader = data.analytics;

    return (
        <div className="grid grid-cols-2 gap-3 mt-6">
            <MetricTile label="Avg Entry" value={formatUsd(trader.avgEntry)} />
            <MetricTile label="Avg Exit" value={formatUsd(trader.avgExit)} />
            <MetricTile label="Scalper Score" value={`${trader.scalperScore}`} />
            <MetricTile label="Rekt Score" value={formatNumber(trader.rektScore, 0)} />
        </div>
    );
}

