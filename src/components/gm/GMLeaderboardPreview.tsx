'use client';

import Link from 'next/link';
import { useGMLeaderboard } from '@/hooks/useGMLeaderboard';
import { DoodleCard } from '@/components/DoodleCard';
import { formatAddress } from '@/utils/format';
import { motion } from 'framer-motion';

export function GMLeaderboardPreview() {
    const { leaderboard, isLoading } = useGMLeaderboard();
    const top = leaderboard.slice(0, 5);

    return (
        <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-black text-xl doodle-text">Streak Gods</h3>
                <Link href="/leaderboards" className="text-sm font-bold text-base-cyan hover:underline">
                    View all →
                </Link>
            </div>

            <DoodleCard color="purple" className="p-2">
                {isLoading && (
                    <div className="space-y-2 p-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-10 bg-black/20 rounded-xl animate-pulse" />
                        ))}
                    </div>
                )}
                {!isLoading && (
                    <div className="space-y-2">
                        {top.map((entry, index) => (
                            <motion.div
                                key={entry.address}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                        ${index === 0 ? 'bg-yellow-400 text-black' : 
                                          index === 1 ? 'bg-gray-300 text-black' : 
                                          index === 2 ? 'bg-orange-400 text-black' : 'bg-white/10'}
                                    `}>
                                        {entry.rank}
                                    </div>
                                    <span className="font-bold text-sm">
                                        {entry.farcaster?.username ? `@${entry.farcaster.username}` : formatAddress(entry.address)}
                                    </span>
                                </div>
                                <span className="font-black text-doodle-orange">{entry.streak} 🔥</span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </DoodleCard>
        </div>
    );
}

