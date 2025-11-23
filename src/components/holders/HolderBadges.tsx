'use client';

import { useHolder } from '@/hooks/useHolder';
import { NeonCard } from '../NeonCard';
import { BadgeGrid } from '../shared/BadgeGrid';

interface HolderBadgesProps {
    address: string;
}

export function HolderBadges({ address }: HolderBadgesProps) {
    const { data, isLoading } = useHolder(address);

    if (isLoading || !data) {
        return (
            <NeonCard className="h-24 animate-pulse">
                <div className="w-full h-full" />
            </NeonCard>
        );
    }

    return (
        <NeonCard>
            <h3 className="text-lg font-semibold mb-3">Badges</h3>
            <BadgeGrid badges={data.holder.badges ?? []} />
        </NeonCard>
    );
}

