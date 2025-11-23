'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CartoonButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    disabled?: boolean;
}

export function CartoonButton({
    children,
    onClick,
    className = '',
    variant = 'primary',
    disabled = false,
}: CartoonButtonProps) {
    const variants = {
        primary: 'bg-base-cyan text-black border-base-cyan hover:bg-[#33ffff]',
        secondary: 'bg-doodle-purple text-white border-doodle-purple hover:bg-[#c6a6ff]',
        danger: 'bg-doodle-pink text-black border-doodle-pink hover:bg-[#ffb3b3]',
        success: 'bg-doodle-green text-black border-doodle-green hover:bg-[#b3fffd]',
    };

    return (
        <motion.button
            className={`
                relative px-6 py-3 rounded-2xl font-bold text-lg border-2
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transition-colors duration-200 flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
            onClick={onClick}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.05, rotate: -1 } : undefined}
            whileTap={!disabled ? { scale: 0.95, rotate: 1, boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)', translateY: 2 } : undefined}
        >
            {children}
        </motion.button>
    );
}

