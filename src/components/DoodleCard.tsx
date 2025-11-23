'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface DoodleCardProps {
    children: ReactNode;
    className?: string;
    color?: 'blue' | 'pink' | 'purple' | 'yellow' | 'green' | 'orange';
    onClick?: () => void;
    animate?: boolean;
}

export function DoodleCard({ 
    children, 
    className = '', 
    color = 'blue',
    onClick,
    animate = true 
}: DoodleCardProps) {
    const shadowColors = {
        blue: 'shadow-doodle',
        pink: 'shadow-doodle-pink',
        purple: 'shadow-doodle-purple',
        yellow: 'shadow-[4px_4px_0px_0px_#FFF385]',
        green: 'shadow-[4px_4px_0px_0px_#9EFFFA]',
        orange: 'shadow-[4px_4px_0px_0px_#FFB86C]',
    };

    const borderColor = {
        blue: 'border-base-cyan',
        pink: 'border-doodle-pink',
        purple: 'border-doodle-purple',
        yellow: 'border-doodle-yellow',
        green: 'border-doodle-green',
        orange: 'border-doodle-orange',
    };

    return (
        <motion.div
            className={`
                relative bg-[#111] border-2 rounded-3xl p-4 backdrop-blur-md
                ${shadowColors[color]} ${borderColor[color]}
                ${className}
            `}
            whileHover={animate && onClick ? { scale: 1.02, translateY: -2 } : undefined}
            whileTap={animate && onClick ? { scale: 0.98, translateY: 0 } : undefined}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}

