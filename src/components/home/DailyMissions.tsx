'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { DoodleCard } from '@/components/DoodleCard';
import { useDailyMissions } from '@/hooks/useDailyMissions';

export function DailyMissions() {
    const { missions } = useDailyMissions();
    const activeMissions = missions.slice(0, 3);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-2xl font-black doodle-text">Daily Missions</h2>
                <Link href="/missions" className="text-base-cyan font-bold text-sm hover:underline">
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
                        <DoodleCard 
                            color={index === 0 ? 'green' : index === 1 ? 'yellow' : 'blue'}
                            className="p-3"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-black/20 p-2 rounded-xl text-2xl">
                                        {mission.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-none">{mission.title}</h3>
                                        <p className="text-xs font-medium opacity-70 mt-1">{mission.description}</p>
                                    </div>
                                </div>
                                {mission.completed && (
                                    <div className="bg-doodle-green text-black p-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden border border-white/10">
                                <motion.div
                                    className={`h-full ${mission.completed ? 'bg-doodle-green' : 'bg-base-cyan'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mission.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                />
                            </div>
                        </DoodleCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

