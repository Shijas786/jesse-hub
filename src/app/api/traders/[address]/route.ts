import { NextResponse } from 'next/server';
import { getHolderTransfers } from '@/lib/covalent';
import { requireEnv, JESSE_DECIMALS } from '@/lib/config';
import { computeTraderAnalytics } from '@/utils/traders';
import { getFarcasterProfiles } from '@/lib/neynar';

const normalize = (address: string) => address.toLowerCase() as `0x${string}`;

export async function GET(
    _request: Request,
    { params }: { params: { address: string } }
) {
    try {
        const address = normalize(params.address);
        const tokenAddress = requireEnv('tokenAddress');

        const transfers = await getHolderTransfers(address, 400);
        const analytics = computeTraderAnalytics(address, transfers, tokenAddress, JESSE_DECIMALS);
        const farcaster = await getFarcasterProfiles([address]);
        analytics.farcaster = farcaster.get(address) ?? null;

        return NextResponse.json({ analytics });
    } catch (error) {
        console.error('trader detail error', error);
        return NextResponse.json({ error: 'Failed to load trader analytics' }, { status: 500 });
    }
}

