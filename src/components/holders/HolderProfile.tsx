'use client';

import { motion } from 'framer-motion';
import { useHolder } from '@/hooks/useHolder';
import { IdentityPill } from '../shared/IdentityPill';
import { NeonCard } from '../NeonCard';
import { formatNumber, formatPercentage, formatUsd, timeAgo } from '@/utils/format';

interface HolderProfileProps {
    address: string;
}

export function HolderProfile({ address }: HolderProfileProps) {
    const { data, isLoading } = useHolder(address);

    if (isLoading || !data) {
        return <NeonCard className="h-32 animate-pulse" />;
    }

    const { holder } = data;

    return (
        <NeonCard glow className="space-y-4">
            <IdentityPill address={holder.address} farcaster={holder.farcaster ?? undefined} />
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-white/60 text-xs">Balance</p>
                    <p className="text-2xl font-bold gradient-text">
                        {formatNumber(holder.balance, 2)} JESSE
                    </p>
                    <p className="text-white/50 text-xs">{formatUsd(holder.balanceQuote ?? 0)}</p>
                </div>
                <div>
                    <p className="text-white/60 text-xs">% Supply</p>
                    <p className="text-2xl font-bold">{formatPercentage(holder.percentage ?? 0)}</p>
                    <p className="text-white/50 text-xs">Rank #{holder.rank}</p>
                </div>
            </div>
            <motion.div
                className="flex items-center justify-between text-xs text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <span>First buy: {holder.firstBuy ? timeAgo(holder.firstBuy) : 'n/a'}</span>
                <span>Last sell: {holder.lastSell ? timeAgo(holder.lastSell) : 'n/a'}</span>
            </motion.div>
        </NeonCard>
    );
}

