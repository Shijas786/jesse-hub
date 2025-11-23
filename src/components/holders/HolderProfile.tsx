'use client';

import { motion } from 'framer-motion';
import { useHolder } from '@/hooks/useHolder';
import { IdentityPill } from '../shared/IdentityPill';
import { DoodleCard } from '@/components/DoodleCard';
import { formatNumber, formatPercentage, formatUsd, timeAgo } from '@/utils/format';

interface HolderProfileProps {
    address: string;
}

export function HolderProfile({ address }: HolderProfileProps) {
    const { data, isLoading } = useHolder(address);

    if (isLoading || !data) {
        return (
            <DoodleCard className="h-32 animate-pulse">
                <div className="w-full h-full" />
            </DoodleCard>
        );
    }

    const { holder } = data;

    return (
        <DoodleCard color="blue" animate={false} className="space-y-4">
            <IdentityPill address={holder.address} farcaster={holder.farcaster ?? undefined} />
            <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-4 rounded-2xl">
                <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase">Balance</p>
                    <p className="text-2xl font-black text-base-cyan">
                        {formatNumber(holder.balance, 0)} JESSE
                    </p>
                    <p className="text-white/50 text-xs font-bold">{formatUsd(holder.balanceQuote ?? 0)}</p>
                </div>
                <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase">% Supply</p>
                    <p className="text-2xl font-black">{formatPercentage(holder.percentage ?? 0)}</p>
                    <p className="text-white/50 text-xs font-bold">Rank #{holder.rank}</p>
                </div>
            </div>
            <motion.div
                className="flex items-center justify-between text-xs text-white/60 font-medium px-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <span>First buy: {holder.firstBuy ? timeAgo(holder.firstBuy) : 'n/a'}</span>
                <span>Last sell: {holder.lastSell ? timeAgo(holder.lastSell) : 'n/a'}</span>
            </motion.div>
        </DoodleCard>
    );
}

