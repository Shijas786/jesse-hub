'use client';

import { motion } from 'framer-motion';
import { HolderCard } from './HolderCard';
import { useHolders } from '@/hooks/useHolders';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { ErrorFallback } from '../ErrorFallback';

interface HoldersListProps {
    filter: 'all' | 'whales' | 'ogs' | 'diamond' | 'paper';
}

export function HoldersList({ filter }: HoldersListProps) {
    const { filteredHolders, isLoading, isError, error, refetch } = useHolders(filter);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return <ErrorFallback error={error} resetError={() => refetch()} title="Failed to load holders" />;
    }

    if (!filteredHolders.length) {
        return <p className="text-center text-white/60 mt-8 font-medium">No holders match this filter 👻</p>;
    }

    return (
        <div className="mt-4 space-y-4">
            {filteredHolders.map((holder, index) => (
                <motion.div
                    key={holder.address}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <HolderCard holder={holder} />
                </motion.div>
            ))}
        </div>
    );
}

