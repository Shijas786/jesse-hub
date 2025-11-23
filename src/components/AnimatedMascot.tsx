'use client';

import { motion } from 'framer-motion';

interface AnimatedMascotProps {
    variant?: 'wave' | 'gm' | 'profit' | 'rekt' | 'head';
    className?: string;
}

export function AnimatedMascot({ variant = 'wave', className = '' }: AnimatedMascotProps) {
    const variants = {
        wave: {
            animate: { rotate: [0, 15, -5, 10, 0], y: [0, -5, 0] },
            transition: { duration: 2, repeat: Infinity, repeatDelay: 3 },
            emoji: '👋',
        },
        gm: {
            animate: { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] },
            transition: { duration: 1.5, repeat: Infinity },
            emoji: '🔥',
        },
        profit: {
            animate: { y: [0, -20, 0] },
            transition: { duration: 1, repeat: Infinity },
            emoji: '🚀',
        },
        rekt: {
            animate: { x: [-5, 5, -5, 5, 0], rotate: [0, 5, -5, 0] },
            transition: { duration: 0.5, repeat: Infinity },
            emoji: '😵',
        },
        head: {
            animate: { y: [0, -10, 0] },
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            emoji: '👨‍🦲',
        },
    };

    const currentVariant = variants[variant];

    return (
        <motion.div
            className={`relative inline-block select-none ${className}`}
            animate={currentVariant.animate}
            transition={currentVariant.transition}
        >
            {/* Placeholder for actual Jesse illustration - using large emoji + shapes for now */}
            <div className="relative z-10 text-6xl filter drop-shadow-lg">
                {currentVariant.emoji}
            </div>
            
            {/* Glow effect behind */}
            <div className="absolute inset-0 bg-base-cyan/30 blur-xl rounded-full scale-150 z-0" />
        </motion.div>
    );
}

