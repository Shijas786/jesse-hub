import { NextResponse } from 'next/server';
import { getGmEvents } from '@/lib/covalent';
import { getFarcasterProfiles } from '@/lib/neynar';
import { buildGmStreakMap } from '@/utils/gm';

export async function GET() {
    try {
        const events = await getGmEvents(600);
        const streakMap = buildGmStreakMap(events);
        const entries = Array.from(streakMap.entries())
            .map(([address, data]) => ({ address, ...data }))
            .sort((a, b) => {
                if (b.streak === a.streak) {
                    return new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime();
                }
                return b.streak - a.streak;
            })
            .slice(0, 50);

        const farcaster = await getFarcasterProfiles(entries.map((entry) => entry.address));
        const leaderboard = entries.map((entry, index) => ({
            rank: index + 1,
            address: entry.address,
            streak: entry.streak,
            lastGm: entry.lastTimestamp,
            farcaster: farcaster.get(entry.address) ?? null,
        }));

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error('gm leaderboard error', error);
        return NextResponse.json({ error: 'Failed to load gm leaderboard' }, { status: 500 });
    }
}

