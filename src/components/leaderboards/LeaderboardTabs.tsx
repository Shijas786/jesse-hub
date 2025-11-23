'use client';

import { motion } from 'framer-motion';

type Tab = 'gm' | 'holders' | 'diamond' | 'whale' | 'scalper' | 'rekt';

const tabs: { id: Tab; label: string }[] = [
    { id: 'gm', label: 'GM Streaks' },
    { id: 'holders', label: 'Top Holders' },
    { id: 'diamond', label: 'Diamond Hands' },
    { id: 'whale', label: 'Whales' },
    { id: 'scalper', label: 'Scalpers' },
    { id: 'rekt', label: 'Rekt Board' },
];

interface LeaderboardTabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
            {tabs.map((tab) => (
                <motion.button
                    key={tab.id}
                    className={`px-4 py-2 rounded-full text-sm ${tab.id === activeTab
                            ? 'bg-gradient-neon text-dark-bg font-semibold'
                            : 'glass-card text-white/70'
                        }`}
                    onClick={() => onTabChange(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {tab.label}
                </motion.button>
            ))}
        </div>
    );
}

