'use client';

import { motion } from 'framer-motion';
import { MissionsList } from '@/components/missions/MissionsList';

export default function MissionsPage() {
    return (
        <div className="px-4 py-8 max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-2 gradient-text">Missions</h1>
                <p className="text-white/60 mb-6">Complete daily tasks and earn rewards</p>
            </motion.div>

            <MissionsList />
        </div>
    );
}
