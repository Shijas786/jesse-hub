'use client';

import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { NeonCard } from '../NeonCard';
import { useGMStreak } from '@/hooks/useGMStreak';

export function HeroSection() {
    const { address, isConnected } = useAccount();
    const { open } = useAppKit();
    const { streak } = useGMStreak(address);

    return (
        <div className="text-center mb-8">
            <motion.h1
                className="text-5xl font-bold mb-4 gradient-text"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Jesse Hub
            </motion.h1>
            <p className="text-white/60 mb-6">Your ultimate Jesse token companion</p>

            {!isConnected ? (
                <motion.button
                    className="px-8 py-3 bg-gradient-neon rounded-full font-semibold text-dark-bg neon-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => open()}
                >
                    Connect Wallet
                </motion.button>
            ) : (
                <NeonCard glow className="mt-4">
                    <div className="text-center">
                        <p className="text-white/60 text-sm mb-2">Your GM Streak</p>
                        <motion.p
                            className="text-4xl font-bold gradient-text"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            {streak} 🔥
                        </motion.p>
                    </div>
                </NeonCard>
            )}
        </div>
    );
}
