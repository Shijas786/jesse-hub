'use client';

import { useTraderAnalytics } from '@/hooks/useTraderAnalytics';
import { NeonCard } from '../NeonCard';
import { IdentityPill } from '../shared/IdentityPill';
import { formatUsd } from '@/utils/format';

interface TraderProfileProps {
    address: string;
}

export function TraderProfile({ address }: TraderProfileProps) {
    const { data, isLoading } = useTraderAnalytics(address);

    if (isLoading || !data) {
        return (
            <NeonCard className="h-28 animate-pulse">
                <div className="w-full h-full" />
            </NeonCard>
        );
    }

    const trader = data.analytics;

    return (
        <NeonCard glow className="space-y-4">
            <IdentityPill address={trader.address} farcaster={trader.farcaster ?? undefined} />
            <div className="flex items-center justify-between text-sm">
                <div>
                    <p className="text-white/60 text-xs">Realized PnL</p>
                    <p className="text-2xl font-bold gradient-text">{formatUsd(trader.realizedProfit)}</p>
                </div>
                <div>
                    <p className="text-white/60 text-xs">Win Rate</p>
                    <p className="text-2xl font-bold">{trader.winRate.toFixed(0)}%</p>
                </div>
                <div>
                    <p className="text-white/60 text-xs">Trades</p>
                    <p className="text-2xl font-bold">{trader.trades.length}</p>
                </div>
            </div>
        </NeonCard>
    );
}

