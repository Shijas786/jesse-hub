'use client';

import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { useGMStreak } from '@/hooks/useGMStreak';
import { NeonCard } from '../NeonCard';

export function GMStreak() {
    const { address, isConnected } = useAccount();
    const { streak, lastGm, isFetching } = useGMStreak(address);

    if (!isConnected) {
        return <NeonCard>Connect your wallet to track your GM streak.</NeonCard>;
    }

    return (
        <NeonCard glow className="w-full mt-6 text-center">
            <p className="text-white/60 text-sm">Current streak</p>
            <motion.p
                className="text-6xl font-extrabold gradient-text flex items-center justify-center gap-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                {isFetching ? '…' : streak}
                <span>🔥</span>
            </motion.p>
            {lastGm && (
                <p className="text-xs text-white/50 mt-2">
                    Last GM: {new Date(lastGm).toLocaleTimeString()}
                </p>
            )}
        </NeonCard>
    );
}

