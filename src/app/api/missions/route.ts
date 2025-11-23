import { NextResponse } from 'next/server';
import { getHolderTransfers, getGmEvents } from '@/lib/covalent';
import { requireEnv } from '@/lib/config';
import { buildBehaviorMap } from '@/utils/holders';
import { buildGmStreakMap } from '@/utils/gm';
import { getFarcasterProfiles, getRecentCastsByFid } from '@/lib/neynar';
import { Mission } from '@/types';

const normalize = (address: string) => address.toLowerCase() as `0x${string}`;

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const addressParam = url.searchParams.get('address');

        if (!addressParam) {
            const missions: Mission[] = [
                {
                    id: 'gm',
                    title: 'GM Ritual',
                    description: 'Fire off an onchain GM',
                    icon: '🔥',
                    progress: 0,
                    completed: false,
                    requirement: 'Complete gm() transaction once per day',
                },
                {
                    id: 'hold',
                    title: 'Hold 24h',
                    description: 'Diamond hands only',
                    icon: '💎',
                    progress: 0,
                    completed: false,
                    requirement: 'Keep your JESSE for 24h straight',
                },
                {
                    id: 'cast',
                    title: '#gmjesse',
                    description: 'Cast the rallying cry',
                    icon: '📢',
                    progress: 0,
                    completed: false,
                    requirement: 'Post #gmjesse on Farcaster',
                },
            ];
            return NextResponse.json({ missions });
        }

        const address = normalize(addressParam);
        const tokenAddress = requireEnv('tokenAddress');

        const [transfers, gmEvents, farcasterMap] = await Promise.all([
            getHolderTransfers(address, 200),
            getGmEvents(200),
            getFarcasterProfiles([address]),
        ]);

        const behavior = buildBehaviorMap(transfers, tokenAddress).get(address);
        const gm = buildGmStreakMap(gmEvents).get(address);
        const profile = farcasterMap.get(address);

        let castProgress = 0;
        if (profile) {
            try {
                const casts = await getRecentCastsByFid(profile.fid, 40);
                const keywordCast = casts.some((cast) =>
                    cast.text.toLowerCase().includes('#gmjesse')
                );
                castProgress = keywordCast ? 100 : 0;
            } catch (error) {
                console.warn('Unable to load casts for missions', error);
            }
        }

        const gmCompleted =
            !!gm && Date.now() - new Date(gm.lastTimestamp).getTime() < 36 * 60 * 60 * 1000;
        const holdProgress = Math.min(100, ((behavior?.daysHeld ?? 0) / 1) * 100);
        const volume = (behavior?.buyValue ?? 0) + (behavior?.sellValue ?? 0);
        const volumeProgress = Math.min(100, (volume / 500) * 100);

        const missions: Mission[] = [
            {
                id: 'gm',
                title: 'GM Ritual',
                description: 'Sign the gm() contract call today',
                icon: '🔥',
                progress: gmCompleted ? 100 : Math.min(100, (gm?.streak ?? 0) * 5),
                completed: gmCompleted,
                requirement: 'Trigger gm() within the last 36 hours',
            },
            {
                id: 'hold',
                title: 'Hold 24h',
                description: 'Diamond hands or bust',
                icon: '💎',
                progress: holdProgress,
                completed: holdProgress >= 100,
                requirement: 'Maintain holdings for 24h',
            },
            {
                id: 'cast',
                title: '#gmjesse Amplifier',
                description: 'Spread the word on Farcaster',
                icon: '📢',
                progress: castProgress,
                completed: castProgress >= 100,
                requirement: 'Post #gmjesse on Farcaster',
            },
            {
                id: 'volume',
                title: 'Scalper Sprint',
                description: 'Generate $500 of volume',
                icon: '⚡',
                progress: volumeProgress,
                completed: volumeProgress >= 100,
                requirement: 'Execute $500 in combined buys + sells',
            },
        ];

        return NextResponse.json({ missions });
    } catch (error) {
        console.error('missions api error', error);
        return NextResponse.json({ error: 'Failed to load missions' }, { status: 500 });
    }
}

