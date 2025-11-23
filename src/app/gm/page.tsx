'use client';

import { motion } from 'framer-motion';
import { GMButton } from '@/components/gm/GMButton';
import { GMStreak } from '@/components/gm/GMStreak';
import { GMLeaderboardPreview } from '@/components/gm/GMLeaderboardPreview';
import { FireAnimation } from '@/components/gm/FireAnimation';

export default function GMPage() {
    return (
        <div className="px-4 py-8 max-w-md mx-auto min-h-screen flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h1 className="text-6xl font-bold mb-4 gradient-text">GM</h1>
                <p className="text-white/60 text-lg">Start or maintain your streak</p>
            </motion.div>

            <FireAnimation />
            <GMStreak />
            <GMButton />
            <GMLeaderboardPreview />
        </div>
    );
}
