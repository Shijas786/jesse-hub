'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function AnimatedCounter({
    value,
    decimals = 0,
    prefix = '',
    suffix = '',
    className = '',
}: AnimatedCounterProps) {
    const spring = useSpring(0, { damping: 50, stiffness: 100 });
    const display = useTransform(spring, (current) =>
        (current as number).toFixed(decimals)
    );

    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        spring.set(value);
        const unsubscribe = display.on('change', (latest) => {
            setDisplayValue(latest);
        });
        return () => unsubscribe();
    }, [value, spring, display]);

    return (
        <motion.span className={className}>
            {prefix}
            {displayValue}
            {suffix}
        </motion.span>
    );
}
