'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HolderSummary } from '@/types';
import { DoodleCard } from '@/components/DoodleCard';
import { IdentityPill } from '../shared/IdentityPill';
import { formatNumber, formatPercentage, formatUsd } from '@/utils/format';

interface HolderCardProps {
    holder: HolderSummary;
}

export function HolderCard({ holder }: HolderCardProps) {
    const cardColor = holder.whale ? 'purple' : holder.diamond ? 'blue' : 'green';

    return (
        <Link href={`/holders/${holder.address}`} className="block mb-4">
            <DoodleCard color={cardColor} animate>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center font-black text-xl">
                            {holder.rank}
                        </div>
                        {holder.whale && (
                            <motion.span
                                className="text-xs px-2 py-1 rounded-lg bg-doodle-purple text-black font-bold border border-black"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🐋 Whale
                            </motion.span>
                        )}
                    </div>
                    <div className="text-2xl">
                        {holder.diamond ? '💎' : holder.paper ? '🧻' : '👋'}
                    </div>
                </div>

                <div className="mb-4">
                    <IdentityPill address={holder.address} farcaster={holder.farcaster} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm bg-black/20 p-3 rounded-2xl">
                    <div>
                        <p className="text-white/50 text-[10px] font-bold uppercase">Balance</p>
                        <p className="font-bold text-base-cyan">{formatNumber(holder.balance, 0)}</p>
                    </div>
                    <div>
                        <p className="text-white/50 text-[10px] font-bold uppercase">Value</p>
                        <p className="font-bold text-doodle-green">{formatUsd(holder.balanceQuote ?? 0)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white/50 text-[10px] font-bold uppercase">%</p>
                        <p className="font-bold">{formatPercentage(holder.percentage ?? 0)}</p>
                    </div>
                </div>
            </DoodleCard>
        </Link>
    );
}


