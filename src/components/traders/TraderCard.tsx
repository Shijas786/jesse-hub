'use client';

import Link from 'next/link';
import { TraderAnalytics } from '@/types';
import { NeonCard } from '../NeonCard';
import { IdentityPill } from '../shared/IdentityPill';
import { formatUsd } from '@/utils/format';

interface TraderCardProps {
    trader: TraderAnalytics;
    rank: number;
    highlight?: string;
}

export function TraderCard({ trader, rank, highlight }: TraderCardProps) {
    return (
        <Link href={`/traders/${trader.address}`} className="block">
            <NeonCard className="mb-3">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-2xl font-black text-neon-blue">{rank}</div>
                    {highlight && <span className="text-xs text-neon-blue">{highlight}</span>}
                </div>
                <IdentityPill address={trader.address} farcaster={trader.farcaster ?? undefined} />
                <div className="flex items-center justify-between mt-4 text-sm">
                    <div>
                        <p className="text-white/50 text-xs">PnL</p>
                        <p className="font-semibold">{formatUsd(trader.realizedProfit)}</p>
                    </div>
                    <div>
                        <p className="text-white/50 text-xs">Win Rate</p>
                        <p className="font-semibold">{trader.winRate.toFixed(0)}%</p>
                    </div>
                    <div>
                        <p className="text-white/50 text-xs">Trades</p>
                        <p className="font-semibold">{trader.trades.length}</p>
                    </div>
                </div>
            </NeonCard>
        </Link>
    );
}

