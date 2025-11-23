'use client';

import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useDailyMissions } from '@/hooks/useDailyMissions';
import { NeonCard } from '../NeonCard';

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
            });
            completedRef.current = missions.filter((mission) => mission.completed).map((mission) => mission.id);
        }
    }, [missions]);

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <NeonCard key={i} className="h-24 animate-pulse">
                        <div className="w-full h-full" />
                    </NeonCard>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {missions.map((mission) => (
                <NeonCard key={mission.id}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{mission.icon}</span>
                            <div>
                                <p className="font-semibold">{mission.title}</p>
                                <p className="text-xs text-white/60">{mission.description}</p>
                            </div>
                        </div>
                        {mission.completed && (
                            <span className="text-xs text-green-400 font-semibold">Completed</span>
                        )}
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                            className="h-full bg-gradient-neon"
                            style={{ width: `${mission.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-white/60 mt-2">{mission.requirement}</p>
                </NeonCard>
            ))}
        </div>
    );
}

