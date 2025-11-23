'use client';

import { motion } from 'framer-motion';

type FilterType = 'all' | 'whales' | 'ogs' | 'diamond' | 'paper';

interface HoldersFiltersProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string; icon: string }[] = [
    { value: 'all', label: 'All', icon: '👥' },
    { value: 'whales', label: 'Whales', icon: '🐋' },
    { value: 'ogs', label: 'OGs', icon: '👑' },
    { value: 'diamond', label: 'Diamond', icon: '💎' },
    { value: 'paper', label: 'Paper', icon: '📄' },
];

export function HoldersFilters({ currentFilter, onFilterChange }: HoldersFiltersProps) {
    return (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
            {filters.map((filter) => {
                const isActive = currentFilter === filter.value;
                return (
                    <motion.button
                        key={filter.value}
                        className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 ${isActive
                                ? 'bg-gradient-neon text-dark-bg font-semibold'
                                : 'glass-card text-white/60'
                            }`}
                        onClick={() => onFilterChange(filter.value)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>{filter.icon}</span>
                        <span>{filter.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
}
