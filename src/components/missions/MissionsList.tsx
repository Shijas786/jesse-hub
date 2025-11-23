'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useDailyMissions } from '@/hooks/useDailyMissions';
import { DoodleCard } from '@/components/DoodleCard';
import { motion } from 'framer-motion';

export function MissionsList() {
    const { missions, isLoading } = useDailyMissions();
    const completedRef = useRef<string[]>([]);

    useEffect(() => {
        const newlyCompleted = missions.filter(
            (mission) => mission.completed && !completedRef.current.includes(mission.id)
        );
        if (newlyCompleted.length) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00f0ff', '#FF9F9F', '#FFF385'],
            });
            completedRef.current = missions.filter((mission) => mission.completed).map((mission) => mission.id);
        }
    }, [missions]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-[#111] rounded-3xl border-2 border-[#333] animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {missions.map((mission, index) => (
                <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <DoodleCard 
                        color={mission.completed ? 'green' : index % 2 === 0 ? 'blue' : 'purple'}
                        className="relative overflow-hidden"
                    >
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="bg-black/20 w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                                {mission.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-black text-lg">{mission.title}</h3>
                                    {mission.completed ? (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-doodle-green text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border border-black"
                                        >
                                            Complete!
                                        </motion.span>
                                    ) : (
                                        <span className="text-white/40 text-xs font-bold">{mission.progress}%</span>
                                    )}
                                </div>
                                <p className="text-sm font-medium opacity-80 mb-2">{mission.description}</p>
                                <p className="text-[10px] uppercase font-bold opacity-50 mb-2">{mission.requirement}</p>
                                
                                <div className="w-full bg-black/30 h-4 rounded-full border border-white/5 overflow-hidden">
                                    <motion.div 
                                        className={`h-full ${mission.completed ? 'bg-doodle-green' : 'bg-base-cyan'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${mission.progress}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* XP Bubble */}
                        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
                            <span className="text-6xl">⭐</span>
                        </div>
                    </DoodleCard>
                </motion.div>
            ))}
        </div>
    );
}

