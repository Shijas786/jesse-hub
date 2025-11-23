'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MetricTileProps {
    label: string;
    value: ReactNode;
    subtext?: string;
}

export function MetricTile({ label, value, subtext }: MetricTileProps) {
    return (
        <motion.div
            className="glass-card p-4 flex flex-col gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
            <p className="text-xs uppercase tracking-wide text-white/60">{label}</p>
            <div className="text-2xl font-bold text-neon-blue">{value}</div>
            {subtext && <p className="text-xs text-white/50">{subtext}</p>}
        </motion.div>
    );
}

