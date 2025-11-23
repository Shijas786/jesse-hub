'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/holders', icon: '👥', label: 'Holders' },
    { href: '/gm', icon: '🔥', label: 'GM' },
    { href: '/traders', icon: '📊', label: 'Traders' },
    { href: '/leaderboards', icon: '🏆', label: 'Ranks' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/10">
            <div className="max-w-md mx-auto px-4 py-3">
                <div className="flex items-center justify-around">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    className="flex flex-col items-center gap-1 relative"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={`text-2xl ${isActive ? 'filter drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : ''}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-xs ${isActive ? 'text-neon-blue font-semibold' : 'text-white/60'}`}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute -bottom-3 left-0 right-0 h-1 bg-neon-blue rounded-full"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
