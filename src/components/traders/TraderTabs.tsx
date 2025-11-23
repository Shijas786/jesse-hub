'use client';

import { motion } from 'framer-motion';

type TraderTab = 'profit' | 'scalper' | 'winners' | 'losers';

const tabs: { id: TraderTab; label: string }[] = [
    { id: 'profit', label: 'Profit' },
    { id: 'scalper', label: 'Scalpers' },
    { id: 'winners', label: 'Winners' },
    { id: 'losers', label: 'Rekt' },
];

interface TraderTabsProps {
    activeTab: TraderTab;
    onTabChange: (tab: TraderTab) => void;
}

export function TraderTabs({ activeTab, onTabChange }: TraderTabsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
            {tabs.map((tab) => (
                <motion.button
                    key={tab.id}
                    className={`px-4 py-2 rounded-full text-sm ${tab.id === activeTab
                            ? 'bg-gradient-neon text-dark-bg'
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

