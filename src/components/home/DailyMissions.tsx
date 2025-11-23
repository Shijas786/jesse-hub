'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { NeonCard } from '../NeonCard';
import { useDailyMissions } from '@/hooks/useDailyMissions';

export function DailyMissions() {
    const { missions } = useDailyMissions();
    const activeMissions = missions.slice(0, 3);

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Daily Missions</h2>
                <Link href="/missions" className="text-neon-blue text-sm">
                    View All →
                </Link>
            </div>

            <div className="space-y-3">
                {activeMissions.map((mission, index) => (
                    <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <NeonCard>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{mission.icon}</span>
                                    <div>
                                        <h3 className="font-semibold">{mission.title}</h3>
                                        <p className="text-xs text-white/60">{mission.description}</p>
                                    </div>
                                </div>
                                {mission.completed && <span className="text-green-400">✓</span>}
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-neon"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mission.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                />
                            </div>
                        </NeonCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
