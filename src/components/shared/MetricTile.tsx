'use client';

import { DoodleCard } from '@/components/DoodleCard';
import { ReactNode } from 'react';

interface MetricTileProps {
    label: string;
    value: ReactNode;
    subtext?: string;
    color?: 'blue' | 'pink' | 'purple' | 'green' | 'orange' | 'yellow';
}

export function MetricTile({ label, value, subtext, color = 'blue' }: MetricTileProps) {
    return (
        <DoodleCard color={color} className="p-3 flex flex-col gap-1" animate>
            <p className="text-[10px] uppercase font-black tracking-wider opacity-60">{label}</p>
            <div className="text-xl font-black text-white break-words">{value}</div>
            {subtext && <p className="text-[10px] text-white/50 font-bold">{subtext}</p>}
        </DoodleCard>
    );
}

