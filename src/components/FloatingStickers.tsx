'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Sticker {
    id: number;
    x: number;
    y: number;
    rotate: number;
    scale: number;
    emoji: string;
    delay: number;
}

const EMOJIS = ['🔵', '✨', '🎨', '🟦', '⚡', '💙', '🔷'];

export function FloatingStickers() {
    const [stickers, setStickers] = useState<Sticker[]>([]);

    useEffect(() => {
        // Generate random stickers only on client side to avoid hydration mismatch
        const newStickers = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random() * 0.5,
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            delay: Math.random() * 5,
        }));
        setStickers(newStickers);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {stickers.map((sticker) => (
                <motion.div
                    key={sticker.id}
                    className="absolute text-2xl opacity-10"
                    style={{
                        left: `${sticker.x}%`,
                        top: `${sticker.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        rotate: [sticker.rotate, sticker.rotate + 20, sticker.rotate],
                    }}
                    transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        delay: sticker.delay,
                        ease: "easeInOut",
                    }}
                >
                    {sticker.emoji}
                </motion.div>
            ))}
        </div>
    );
}

