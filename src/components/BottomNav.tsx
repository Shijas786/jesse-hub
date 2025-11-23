'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/', icon: '🏠', label: 'Home', color: 'bg-base-cyan' },
    { href: '/holders', icon: '👥', label: 'Holders', color: 'bg-doodle-pink' },
    { href: '/gm', icon: '🔥', label: 'GM', color: 'bg-doodle-orange' },
    { href: '/traders', icon: '📊', label: 'Traders', color: 'bg-doodle-purple' },
    { href: '/leaderboards', icon: '🏆', label: 'Ranks', color: 'bg-doodle-yellow' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-6 left-0 right-0 z-50 pointer-events-none">
            <div className="max-w-sm mx-auto px-4 pointer-events-auto">
                <motion.div 
                    className="bg-[#111]/90 backdrop-blur-xl border-2 border-base-border rounded-full p-2 shadow-doodle flex items-center justify-between"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                >
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <Link key={item.href} href={item.href} className="relative">
                                <motion.div
                                    className={`
                                        relative flex items-center justify-center w-12 h-12 rounded-full
                                        ${isActive ? item.color : 'bg-transparent hover:bg-white/5'}
                                    `}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <span className={`text-2xl ${isActive ? 'grayscale-0' : 'grayscale opacity-60'}`}>
                                        {item.icon}
                                    </span>
                                    
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-full border-2 border-black opacity-20"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </motion.div>
            </div>
        </nav>
    );
}
