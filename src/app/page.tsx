'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickStats } from '@/components/home/QuickStats';
import { DailyMissions } from '@/components/home/DailyMissions';
import { ParticleBackground } from '@/components/ParticleBackground';

export default function Home() {
    return (
        <div className="relative">
            <ParticleBackground />
            <div className="relative z-10 px-4 py-8 max-w-md mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <HeroSection />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <QuickStats />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <DailyMissions />
                </motion.div>
            </div>
        </div>
    );
}
