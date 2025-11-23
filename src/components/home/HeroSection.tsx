'use client';

import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { DoodleCard } from '@/components/DoodleCard';
import { CartoonButton } from '@/components/CartoonButton';
import { AnimatedMascot } from '@/components/AnimatedMascot';
import { useGMStreak } from '@/hooks/useGMStreak';

export function HeroSection() {
    const { address, isConnected } = useAccount();
    const { open } = useAppKit();
    const { streak } = useGMStreak(address);

    return (
        <div className="text-center mb-8 relative">
            <motion.div 
                className="mb-4 inline-block"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
            >
                <AnimatedMascot variant="wave" className="scale-150" />
            </motion.div>

            <motion.h1
                className="text-5xl font-black mb-4 doodle-text tracking-tight"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                Jesse Hub
            </motion.h1>
            <p className="text-white/80 mb-6 text-lg font-medium font-handwriting">Your ultimate Jesse token companion</p>

            {!isConnected ? (
                <CartoonButton 
                    onClick={() => open()}
                    className="mx-auto"
                    variant="primary"
                >
                    Connect Wallet 👛
                </CartoonButton>
            ) : (
                <div className="flex justify-center gap-4 mt-6">
                    <DoodleCard color="orange" className="p-4 min-w-[160px]">
                        <p className="text-white/80 text-xs mb-1 font-bold uppercase tracking-wide">Your Streak</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-4xl font-black text-outline">{streak}</span>
                            <motion.span 
                                className="text-3xl"
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                🔥
                            </motion.span>
                        </div>
                    </DoodleCard>
                </div>
            )}
        </div>
    );
}
