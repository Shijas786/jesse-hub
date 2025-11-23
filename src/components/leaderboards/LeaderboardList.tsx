'use client';

import { IdentityPill } from '../shared/IdentityPill';

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
        return <p className="text-white/60 text-sm">{emptyLabel}</p>;
    }

    return (
        <div className="space-y-3">
            {entries.map((entry) => (
                <div key={entry.address} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-black text-neon-blue">{entry.rank}</div>
                        <IdentityPill address={entry.address} farcaster={entry.farcaster ?? undefined} />
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-neon-blue">{entry.value}</p>
                        {entry.subtitle && <p className="text-xs text-white/60">{entry.subtitle}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

