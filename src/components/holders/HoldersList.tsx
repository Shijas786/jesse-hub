'use client';

import { HolderCard } from './HolderCard';
import { useHolders } from '@/hooks/useHolders';
import { LoadingSkeleton } from '../LoadingSkeleton';

interface HoldersListProps {
    filter: 'all' | 'whales' | 'ogs' | 'diamond' | 'paper';
}

export function HoldersList({ filter }: HoldersListProps) {
    const { filteredHolders, isLoading, isError } = useHolders(filter);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (isError) {
        return (
            <div className="mt-4 text-center">
                <p className="text-red-400 text-sm mb-2">
                    ⚠️ Failed to load holders. Check browser console for details.
                </p>
                <p className="text-white/40 text-xs">
                    Make sure environment variables are set in Vercel.
                </p>
            </div>
        );
    }

    if (!filteredHolders.length) {
        return <p className="text-center text-white/60">No holders match this filter.</p>;
    }

    return (
        <div className="mt-4">
            {filteredHolders.map((holder) => (
                <HolderCard key={holder.address} holder={holder} />
            ))}
        </div>
    );
}

