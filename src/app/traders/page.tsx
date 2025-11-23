'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TraderTabs } from '@/components/traders/TraderTabs';
import { ProfitLeaderboard } from '@/components/traders/ProfitLeaderboard';
import { ScalpersList } from '@/components/traders/ScalpersList';
import { WinnersList } from '@/components/traders/WinnersList';
import { LosersList } from '@/components/traders/LosersList';

export default function TradersPage() {
    const [activeTab, setActiveTab] = useState<'profit' | 'scalper' | 'winners' | 'losers'>('profit');

    return (
        <div className="px-4 py-8 max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-2 gradient-text">Traders</h1>
                <p className="text-white/60 mb-6">Track trading performance</p>
            </motion.div>

            <TraderTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === 'profit' && <ProfitLeaderboard />}
                {activeTab === 'scalper' && <ScalpersList />}
                {activeTab === 'winners' && <WinnersList />}
                {activeTab === 'losers' && <LosersList />}
            </motion.div>
        </div>
    );
}
