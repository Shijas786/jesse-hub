import { motion } from 'framer-motion';
import { HolderProfile } from '@/components/holders/HolderProfile';
import { HolderStats } from '@/components/holders/HolderStats';
import { HolderActivity } from '@/components/holders/HolderActivity';
import { HolderBadges } from '@/components/holders/HolderBadges';

export default function HolderDetailPage({ params }: { params: { address: string } }) {
    const { address } = params;

    return (
        <div className="px-4 py-8 max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <HolderProfile address={address} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <HolderBadges address={address} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <HolderStats address={address} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <HolderActivity address={address} />
            </motion.div>
        </div>
    );
}
