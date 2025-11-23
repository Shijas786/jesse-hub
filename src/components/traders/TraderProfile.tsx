'use client';

import { useTraderAnalytics } from '@/hooks/useTraderAnalytics';
import { DoodleCard } from '@/components/DoodleCard';
import { IdentityPill } from '../shared/IdentityPill';
import { formatUsd } from '@/utils/format';

interface TraderProfileProps {
    address: string;
}

export function TraderProfile({ address }: TraderProfileProps) {
    const { data, isLoading } = useTraderAnalytics(address);

    if (isLoading || !data) {
        return (
            <DoodleCard className="h-28 animate-pulse">
                <div className="w-full h-full" />
            </DoodleCard>
        );
    }

    const trader = data.analytics;
    const isProfitable = trader.realizedProfit >= 0;

    return (
        <DoodleCard color={isProfitable ? 'green' : 'pink'} className="space-y-4">
            <IdentityPill address={trader.address} farcaster={trader.farcaster ?? undefined} />
            <div className="grid grid-cols-3 gap-2 text-sm bg-black/10 p-4 rounded-2xl">
                <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase">Realized PnL</p>
                    <p className={`text-xl font-black ${isProfitable ? 'text-doodle-green' : 'text-doodle-pink'}`}>
                        {formatUsd(trader.realizedProfit)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-white/60 text-[10px] font-bold uppercase">Win Rate</p>
                    <p className="text-xl font-black">{trader.winRate.toFixed(0)}%</p>
                </div>
                <div className="text-right">
                    <p className="text-white/60 text-[10px] font-bold uppercase">Trades</p>
                    <p className="text-xl font-black">{trader.trades.length}</p>
                </div>
            </div>
        </DoodleCard>
    );
}

