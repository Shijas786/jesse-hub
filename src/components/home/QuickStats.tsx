'use client';

import { motion } from 'framer-motion';
import { NeonCard } from '../NeonCard';
import { AnimatedCounter } from '../AnimatedCounter';
import { useJesseStats } from '@/hooks/useJesseStats';

export function QuickStats() {
    const { totalHolders, totalSupply, topHolder, loading } = useJesseStats();

    const stats = [
        { label: 'Total Holders', value: totalHolders, suffix: '' },
        { label: 'Total Supply', value: totalSupply, suffix: ' JESSE', decimals: 0 },
        { label: 'Top Holder %', value: topHolder, suffix: '%', decimals: 2 },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-4 h-24 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-3 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <NeonCard className="text-center">
                        <p className="text-xs text-white/60 mb-2">{stat.label}</p>
                        <p className="text-lg font-bold text-neon-blue">
                            <AnimatedCounter
                                value={stat.value}
                                decimals={stat.decimals}
                                suffix={stat.suffix}
                            />
                        </p>
                    </NeonCard>
                </motion.div>
            ))}
        </div>
    );
}
