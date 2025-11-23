'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HolderSummary } from '@/types';
import { NeonCard } from '../NeonCard';
import { IdentityPill } from '../shared/IdentityPill';
import { formatNumber, formatPercentage, formatUsd } from '@/utils/format';

interface HolderCardProps {
    holder: HolderSummary;
}

export function HolderCard({ holder }: HolderCardProps) {
    return (
        <Link href={`/holders/${holder.address}`} className="block">
            <NeonCard className="mb-4">
                <div className="flex items-center justify-between">
                    <div className="text-3xl font-black text-neon-blue neon-text">{holder.rank}</div>
                    {holder.whale && (
                        <motion.span
                            className="text-xs px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Whale
                        </motion.span>
                    )}
                </div>
                <div className="mt-4">
                    <IdentityPill address={holder.address} farcaster={holder.farcaster} />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                    <div>
                        <p className="text-white/50 text-xs">Balance</p>
                        <p className="font-semibold">{formatNumber(holder.balance, 2)} JESSE</p>
                    </div>
                    <div>
                        <p className="text-white/50 text-xs">Value</p>
                        <p className="font-semibold">{formatUsd(holder.balanceQuote ?? 0)}</p>
                    </div>
                    <div>
                        <p className="text-white/50 text-xs">% Supply</p>
                        <p className="font-semibold">{formatPercentage(holder.percentage ?? 0)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-white/60">
                    <span>GM streak: {holder.gmStreak}</span>
                    <span>{holder.paper ? '📄 Paper' : holder.diamond ? '💎 Diamond' : '🔥 Active'}</span>
                </div>
            </NeonCard>
        </Link>
    );
}

