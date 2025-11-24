import { NextResponse } from 'next/server';
import { getGmEvents } from '@/lib/goldrush';
import { getFarcasterProfiles } from '@/lib/neynar';
import { buildGmStreakMap } from '@/utils/gm';

export const dynamic = 'force-dynamic';

const GM_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS ||
    process.env.JESSE_GM_CONTRACT_ADDRESS;

export async function GET() {
    try {
        if (!GM_CONTRACT_ADDRESS) {
            return NextResponse.json(
                {
                    error: 'Config error',
                    message: 'Missing NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS environment variable',
                },
                { status: 500 }
            );
        }

        const events = await getGmEvents(GM_CONTRACT_ADDRESS, 600);
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
        const isDev = process.env.NODE_ENV === 'development';
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        
        console.error('GET /api/leaderboards/gm error:', {
            message,
            stack: isDev ? stack : undefined,
            error: error instanceof Error ? error.toString() : String(error),
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to load gm leaderboard',
                message: isDev ? message : 'Internal server error',
                ...(isDev && stack ? { stack } : {}),
            },
            { status: 500 }
        );
    }
}

