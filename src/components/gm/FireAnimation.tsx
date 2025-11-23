'use client';

import { motion } from 'framer-motion';

export function FireAnimation() {
    return (
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
            {[0, 1, 2].map((layer) => (
                <motion.div
                    key={layer}
                    className="absolute w-24 h-24 rounded-full blur-2xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,140,0,0.8) 0%, rgba(5,5,5,0) 70%)',
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                        duration: 2 + layer * 0.3,
                        repeat: Infinity,
                        delay: layer * 0.2,
                    }}
                />
            ))}
            <motion.div
                className="text-5xl"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3 }}
            >
                🔥
            </motion.div>
        </div>
    );
}

