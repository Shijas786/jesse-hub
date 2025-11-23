'use client';

import Link from 'next/link';
import { TraderAnalytics } from '@/types';
import { DoodleCard } from '@/components/DoodleCard';
import { IdentityPill } from '../shared/IdentityPill';
import { formatUsd } from '@/utils/format';

interface TraderCardProps {
    trader: TraderAnalytics;
    rank: number;
    highlight?: string;
}

export function TraderCard({ trader, rank, highlight }: TraderCardProps) {
    const isProfitable = trader.realizedProfit >= 0;
    const cardColor = isProfitable ? 'green' : 'pink';

    return (
        <Link href={`/traders/${trader.address}`} className="block mb-4">
            <DoodleCard color={cardColor} animate>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center font-black">
                            {rank}
                        </div>
                        {highlight && (
                            <span className="text-[10px] px-2 py-1 rounded-md bg-black/10 font-bold uppercase">
                                {highlight}
                            </span>
                        )}
                    </div>
                    <div className="text-xl">
                        {isProfitable ? '🚀' : '📉'}
                    </div>
                </div>

                <div className="mb-3">
                    <IdentityPill address={trader.address} farcaster={trader.farcaster ?? undefined} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm bg-black/10 p-2 rounded-xl">
                    <div>
                        <p className="opacity-50 text-[10px] font-bold uppercase">PnL</p>
                        <p className={`font-black ${isProfitable ? 'text-doodle-green' : 'text-doodle-pink'}`}>
                            {formatUsd(trader.realizedProfit)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="opacity-50 text-[10px] font-bold uppercase">Win Rate</p>
                        <p className="font-bold">{trader.winRate.toFixed(0)}%</p>
                    </div>
                    <div className="text-right">
                        <p className="opacity-50 text-[10px] font-bold uppercase">Trades</p>
                        <p className="font-bold">{trader.trades.length}</p>
                    </div>
                </div>
            </DoodleCard>
        </Link>
    );
}

