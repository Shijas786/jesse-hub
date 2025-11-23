import { motion } from 'framer-motion';
import { TraderProfile } from '@/components/traders/TraderProfile';
import { TraderStats } from '@/components/traders/TraderStats';
import { TraderTimeline } from '@/components/traders/TraderTimeline';
import { TraderMetrics } from '@/components/traders/TraderMetrics';

export default function TraderDetailPage({ params }: { params: { address: string } }) {
    const { address } = params;

    return (
        <div className="px-4 py-8 max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <TraderProfile address={address} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <TraderStats address={address} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <TraderMetrics address={address} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <TraderTimeline address={address} />
            </motion.div>
        </div>
    );
}
