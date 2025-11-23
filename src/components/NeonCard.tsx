'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NeonCardProps {
    children: ReactNode;
    className?: string;
    glow?: boolean;
    onClick?: () => void;
}

export function NeonCard({ children, className = '', glow = false, onClick }: NeonCardProps) {
    return (
        <motion.div
            className={`glass-card p-4 ${glow ? 'neon-glow' : ''} ${className}`}
            whileHover={{ scale: 1.02, boxShadow: glow ? '0 0 30px rgba(0, 240, 255, 0.5)' : undefined }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
