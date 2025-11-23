'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HoldersList } from '@/components/holders/HoldersList';
import { HoldersFilters } from '@/components/holders/HoldersFilters';

export default function HoldersPage() {
    const [filter, setFilter] = useState<'all' | 'whales' | 'ogs' | 'diamond' | 'paper'>('all');

    return (
        <div className="px-4 py-8 max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-2 gradient-text">Holders</h1>
                <p className="text-white/60 mb-6">Top Jesse token holders</p>
            </motion.div>

            <HoldersFilters currentFilter={filter} onFilterChange={setFilter} />
            <HoldersList filter={filter} />
        </div>
    );
}
