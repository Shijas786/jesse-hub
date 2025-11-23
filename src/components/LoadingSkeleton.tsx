'use client';

import { motion } from 'framer-motion';

export function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    className="glass-card p-4 h-24"
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                    }}
                >
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/10 rounded w-1/2" />
                </motion.div>
            ))}
        </div>
    );
}
