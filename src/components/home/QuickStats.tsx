'use client';

import { motion } from 'framer-motion';
import { DoodleCard } from '@/components/DoodleCard';
import { AnimatedCounter } from '../AnimatedCounter';
import { useJesseStats } from '@/hooks/useJesseStats';

export function QuickStats() {
    const { totalHolders, totalSupply, topHolder, isLoading, isError } = useJesseStats();

    const stats = [
        { label: 'Holders', value: totalHolders, suffix: '', color: 'blue' },
        { label: 'Supply', value: totalSupply, suffix: '', decimals: 0, color: 'pink' },
        { label: 'Whale %', value: topHolder, suffix: '%', decimals: 1, color: 'purple' },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-[#111] border-2 border-[#333] rounded-3xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <DoodleCard color="pink" className="mb-8 p-4 text-center">
                <p className="text-red-300 text-sm font-bold">
                    ⚠️ Failed to load stats
                </p>
            </DoodleCard>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <DoodleCard color={stat.color as any} className="text-center p-2 h-full flex flex-col justify-center">
                        <p className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-1">{stat.label}</p>
                        <p className="text-base font-black leading-tight break-words">
                            <AnimatedCounter
                                value={stat.value}
                                decimals={stat.decimals}
                                suffix={stat.suffix}
                            />
                        </p>
                    </DoodleCard>
                </motion.div>
            ))}
        </div>
    );
}
