'use client';

import { useHolder } from '@/hooks/useHolder';
import { MetricTile } from '../shared/MetricTile';
import { formatNumber, formatUsd } from '@/utils/format';

interface HolderStatsProps {
    address: string;
}

export function HolderStats({ address }: HolderStatsProps) {
    const { data, isLoading } = useHolder(address);

    if (isLoading || !data) {
        return (
            <div className="grid grid-cols-2 gap-3 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-black/20 rounded-2xl" />
                ))}
            </div>
        );
    }

    const { holder, realizedProfit } = data;

    return (
        <div className="grid grid-cols-2 gap-3 mt-6">
            <MetricTile label="Days Held" value={holder.daysHeld ?? 0} subtext="Since first buy" color="blue" />
            <MetricTile label="GM Streak" value={`${holder.gmStreak} 🔥`} subtext="Onchain" color="orange" />
            <MetricTile label="Total Buys" value={formatNumber(holder.totalBuys ?? 0, 2)} color="green" />
            <MetricTile label="Total Sells" value={formatNumber(holder.totalSells ?? 0, 2)} color="pink" />
            <MetricTile
                label="Diamond Score"
                value={formatNumber(holder.diamondScore ?? 0, 0)}
                subtext="Higher = stronger hands"
                color="purple"
            />
            <MetricTile
                label="Profit"
                value={formatUsd(realizedProfit)}
                subtext={realizedProfit >= 0 ? 'In the green' : 'Time to recover'}
                color={realizedProfit >= 0 ? 'green' : 'pink'}
            />
        </div>
    );
}

