'use client';

import Link from 'next/link';
import { useGMLeaderboard } from '@/hooks/useGMLeaderboard';
import { NeonCard } from '../NeonCard';
import { formatAddress } from '@/utils/format';

export function GMLeaderboardPreview() {
    const { leaderboard, isLoading } = useGMLeaderboard();
    const top = leaderboard.slice(0, 5);

    return (
        <NeonCard className="w-full mt-8">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Streak Gods</h3>
                <Link href="/leaderboards" className="text-xs text-neon-blue">
                    View all →
                </Link>
            </div>
            {isLoading && <p className="text-white/60 text-sm">Loading leaderboard…</p>}
            {!isLoading && (
                <div className="space-y-2">
                    {top.map((entry) => (
                        <div
                            key={entry.address}
                            className="flex items-center justify-between text-sm text-white/80"
                        >
                            <span>
                                {entry.rank}. {entry.farcaster?.username ? `@${entry.farcaster.username}` : formatAddress(entry.address)}
                            </span>
                            <span className="text-neon-blue font-semibold">{entry.streak}🔥</span>
                        </div>
                    ))}
                </div>
            )}
        </NeonCard>
    );
}

