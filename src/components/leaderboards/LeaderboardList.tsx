'use client';

import { IdentityPill } from '../shared/IdentityPill';
import { DoodleCard } from '@/components/DoodleCard';
import { motion } from 'framer-motion';

interface Entry {
    rank: number;
    address: `0x${string}`;
    value: string;
    subtitle?: string;
    farcaster?: {
        username: string;
        displayName: string;
        avatar: string;
    } | null;
}

interface LeaderboardListProps {
    entries: Entry[];
    emptyLabel?: string;
}

export function LeaderboardList({ entries, emptyLabel = 'No data yet.' }: LeaderboardListProps) {
    if (!entries.length) {
        return <p className="text-white/60 text-sm text-center font-bold">{emptyLabel}</p>;
    }

    return (
        <div className="space-y-3">
            {entries.map((entry, index) => (
                <motion.div
                    key={entry.address}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <DoodleCard 
                        color={index === 0 ? 'yellow' : index === 1 ? 'green' : index === 2 ? 'orange' : 'blue'}
                        className="p-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center font-black text-lg
                                    ${index < 3 ? 'bg-black/20 text-black' : 'bg-black/20 text-white/50'}
                                `}>
                                    {entry.rank}
                                </div>
                                <IdentityPill address={entry.address} farcaster={entry.farcaster ?? undefined} />
                            </div>
                            <div className="text-right">
                                <p className="font-black text-lg leading-none">{entry.value}</p>
                                {entry.subtitle && <p className="text-[10px] font-bold uppercase opacity-60 mt-1">{entry.subtitle}</p>}
                            </div>
                        </div>
                    </DoodleCard>
                </motion.div>
            ))}
        </div>
    );
}

