'use client';

import { useHolder } from '@/hooks/useHolder';
import { DoodleCard } from '@/components/DoodleCard';
import { BadgeGrid } from '../shared/BadgeGrid';

interface HolderBadgesProps {
    address: string;
}

export function HolderBadges({ address }: HolderBadgesProps) {
    const { data, isLoading } = useHolder(address);

    if (isLoading || !data) {
        return (
            <DoodleCard className="h-24 animate-pulse">
                <div className="w-full h-full" />
            </DoodleCard>
        );
    }

    return (
        <DoodleCard color="yellow" className="mt-6">
            <h3 className="text-lg font-black mb-3 doodle-text">Badges</h3>
            <BadgeGrid badges={data.holder.badges ?? []} />
        </DoodleCard>
    );
}

