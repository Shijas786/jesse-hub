'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickStats } from '@/components/home/QuickStats';
import { DailyMissions } from '@/components/home/DailyMissions';

export default function Home() {
    return (
        <div className="relative space-y-6">
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
    );
}
