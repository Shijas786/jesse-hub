'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LeaderboardTabs } from '@/components/leaderboards/LeaderboardTabs';
import { GMStreakLeaderboard } from '@/components/leaderboards/GMStreakLeaderboard';
import { TopHoldersLeaderboard } from '@/components/leaderboards/TopHoldersLeaderboard';
import { DiamondHandsLeaderboard } from '@/components/leaderboards/DiamondHandsLeaderboard';
import { WhaleLeaderboard } from '@/components/leaderboards/WhaleLeaderboard';
import { ScalperLeaderboard } from '@/components/leaderboards/ScalperLeaderboard';
import { RektLeaderboard } from '@/components/leaderboards/RektLeaderboard';

export default function LeaderboardsPage() {
    const [activeTab, setActiveTab] = useState<'gm' | 'holders' | 'diamond' | 'whale' | 'scalper' | 'rekt'>('gm');

    return (
        <div className="px-4 py-8 max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-2 gradient-text">Leaderboards</h1>
                <p className="text-white/60 mb-6">Compete and climb the ranks</p>
            </motion.div>

            <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'gm' && <GMStreakLeaderboard />}
                {activeTab === 'holders' && <TopHoldersLeaderboard />}
                {activeTab === 'diamond' && <DiamondHandsLeaderboard />}
                {activeTab === 'whale' && <WhaleLeaderboard />}
                {activeTab === 'scalper' && <ScalperLeaderboard />}
                {activeTab === 'rekt' && <RektLeaderboard />}
            </motion.div>
        </div>
    );
}
