'use client';

import { BADGE_REGISTRY } from '@/utils/badges';
import { BadgeId } from '@/types';

interface BadgeGridProps {
    badges: BadgeId[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
    if (!badges.length) {
        return <p className="text-white/60 text-sm">No badges yet. Complete missions to unlock.</p>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((badge) => {
                const metadata = BADGE_REGISTRY[badge];
                return (
                    <div
                        key={badge}
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${metadata.theme} text-dark-bg neon-glow`}
                    >
                        <span className="mr-2">{metadata.icon}</span>
                        {metadata.label}
                    </div>
                );
            })}
        </div>
    );
}

