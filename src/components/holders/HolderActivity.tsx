'use client';

import { useHolder } from '@/hooks/useHolder';
import { MiniLineChart } from '../charts/MiniLineChart';
import { NeonCard } from '../NeonCard';

interface HolderActivityProps {
    address: string;
}

export function HolderActivity({ address }: HolderActivityProps) {
    const { data, isLoading } = useHolder(address);

    if (isLoading || !data) {
        return (
            <NeonCard className="h-48 animate-pulse">
                <div className="w-full h-full" />
            </NeonCard>
        );
    }

    if (!data.holder.activity.length) {
        return <NeonCard>No recent activity recorded.</NeonCard>;
    }

    return (
        <NeonCard>
            <h3 className="text-lg font-semibold mb-3">Activity</h3>
            <MiniLineChart data={data.holder.activity} />
        </NeonCard>
    );
}

