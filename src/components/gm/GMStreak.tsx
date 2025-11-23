'use client';

import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { useGMStreak } from '@/hooks/useGMStreak';
import { DoodleCard } from '@/components/DoodleCard';

export function GMStreak() {
    const { address, isConnected } = useAccount();
    const { streak, lastGm, isFetching } = useGMStreak(address);

    if (!isConnected) {
        return (
            <DoodleCard color="blue" className="w-full mt-6 text-center p-6">
                <p className="font-bold text-white/90">Connect wallet to see your streak!</p>
            </DoodleCard>
        );
    }

    return (
        <DoodleCard color="orange" className="w-full mt-6 text-center p-8">
            <p className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">Current streak</p>
            <motion.div
                className="flex items-center justify-center gap-2 mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <span className="text-7xl font-black text-outline">{isFetching ? '…' : streak}</span>
                <span className="text-6xl filter drop-shadow-lg">🔥</span>
            </motion.div>
            {lastGm && (
                <div className="inline-block bg-black/20 px-3 py-1 rounded-full text-xs font-mono text-white/70">
                    Last GM: {new Date(lastGm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
        </DoodleCard>
    );
}

