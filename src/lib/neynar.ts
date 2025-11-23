import { requireEnv } from './config';
import { FarcasterProfile } from '@/types';

const NEYNAR_ENDPOINT = 'https://api.neynar.com/v2/farcaster/user/bulk-by-address';

interface NeynarUser {
    fid: number;
    username: string;
    display_name: string;
    bio: {
        text: string;
    };
    follower_count: number;
    custody_address: `0x${string}`;
    pfp_url: string;
}

interface NeynarResponse {
    users: NeynarUser[];
}

interface NeynarFeedResponse {
    casts: Array<{
        hash: string;
        text: string;
        timestamp: string;
    }>;
}

const chunkAddresses = (addresses: string[], chunkSize = 30) => {
    const chunks: string[][] = [];
    for (let i = 0; i < addresses.length; i += chunkSize) {
        chunks.push(addresses.slice(i, i + chunkSize));
    }
    return chunks;
};

export async function getFarcasterProfiles(addresses: `0x${string}`[]) {
    const apiKey = requireEnv('neynarKey');
    const map = new Map<`0x${string}`, FarcasterProfile>();

    if (!addresses.length) {
        return map;
    }

    const chunks = chunkAddresses(
        Array.from(new Set(addresses.map((addr) => addr.toLowerCase()))) as `0x${string}`[],
        30
    );

    for (const chunk of chunks) {
        const url = new URL(NEYNAR_ENDPOINT);
        url.searchParams.set('addresses', chunk.join(','));

        const response = await fetch(url.toString(), {
            headers: {
                'Content-Type': 'application/json',
                'api_key': apiKey,
            },
            next: { revalidate: 120 },
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Neynar request failed: ${text}`);
        }

        const data = (await response.json()) as NeynarResponse;

        data.users.forEach((user) => {
            map.set(user.custody_address.toLowerCase() as `0x${string}`, {
                fid: user.fid,
                username: user.username,
                displayName: user.display_name,
                bio: user.bio?.text ?? '',
                avatar: user.pfp_url,
                followerCount: user.follower_count,
            });
        });
    }

    return map;
}

export async function getRecentCastsByFid(fid: number, limit = 25) {
    const apiKey = requireEnv('neynarKey');
    const url = new URL('https://api.neynar.com/v2/farcaster/feed/user');
    url.searchParams.set('fid', String(fid));
    url.searchParams.set('with_recasts', 'false');
    url.searchParams.set('with_replies', 'true');
    url.searchParams.set('limit', String(limit));

    const response = await fetch(url.toString(), {
        headers: {
            'Content-Type': 'application/json',
            'api_key': apiKey,
        },
        next: { revalidate: 120 },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Neynar feed request failed: ${text}`);
    }

    const data = (await response.json()) as NeynarFeedResponse;
    return data.casts ?? [];
}

