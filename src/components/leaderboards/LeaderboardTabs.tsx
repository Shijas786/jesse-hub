'use client';

import { motion } from 'framer-motion';

type Tab = 'gm' | 'holders' | 'diamond' | 'whale' | 'scalper' | 'rekt';

const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'gm', label: 'GM', emoji: '🔥' },
    { id: 'holders', label: 'Holders', emoji: '👥' },
    { id: 'diamond', label: 'Diamond', emoji: '💎' },
    { id: 'whale', label: 'Whales', emoji: '🐋' },
    { id: 'scalper', label: 'Scalpers', emoji: '⚡' },
    { id: 'rekt', label: 'Rekt', emoji: '😵' },
];

interface LeaderboardTabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2 px-1">
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <motion.button
                        key={tab.id}
                        className={`
                            px-4 py-2 rounded-xl text-sm font-bold border-2 whitespace-nowrap flex items-center gap-2
                            transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                            ${isActive 
                                ? 'bg-base-cyan border-black text-black' 
                                : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/10'}
                        `}
                        onClick={() => onTabChange(tab.id)}
                        whileHover={{ scale: 1.05, rotate: -1 }}
                        whileTap={{ scale: 0.95, rotate: 1 }}
                    >
                        <span>{tab.emoji}</span>
                        {tab.label}
                    </motion.button>
                );
            })}
        </div>
    );
}

