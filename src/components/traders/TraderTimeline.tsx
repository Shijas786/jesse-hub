'use client';

import { useMemo } from 'react';
import { useTraderAnalytics } from '@/hooks/useTraderAnalytics';
import { MiniLineChart } from '../charts/MiniLineChart';
import { NeonCard } from '../NeonCard';

interface TraderTimelineProps {
    address: string;
}

export function TraderTimeline({ address }: TraderTimelineProps) {
    const { data, isLoading } = useTraderAnalytics(address);

    const timeline = useMemo(() => {
        if (!data) return [];
        const { analytics } = data;
        const sorted = [...analytics.trades].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        let cumulative = 0;
        const points: { timestamp: string; value: number }[] = [];

        sorted.forEach((trade) => {
            if (trade.direction === 'sell') {
                const pnl = (trade.price - analytics.avgEntry) * trade.amount;
                cumulative += pnl;
                points.push({ timestamp: trade.timestamp, value: cumulative });
            }
        });

        return points;
    }, [data]);

    if (isLoading || !data) {
        return <NeonCard className="h-48 animate-pulse" />;
    }

    if (!timeline.length) {
        return <NeonCard>No sells yet — nothing to chart.</NeonCard>;
    }

    return (
        <NeonCard className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Profit Timeline</h3>
            <MiniLineChart data={timeline} />
        </NeonCard>
    );
}

