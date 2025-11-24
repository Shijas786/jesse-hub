import { NextResponse } from 'next/server';
import { getHolderTransfers } from '@/lib/goldrush';
import { getJesseTokenAddress, JESSE_DECIMALS } from '@/lib/config';
import { computeTraderAnalytics } from '@/utils/traders';
import { getFarcasterProfiles } from '@/lib/neynar';

export const dynamic = 'force-dynamic';

const normalize = (address: string) => address.toLowerCase() as `0x${string}`;

export async function GET(
    _request: Request,
    { params }: { params: { address: string } }
) {
    try {
        const address = normalize(params.address);
        const tokenAddress = getJesseTokenAddress();

        const transfers = await getHolderTransfers(address, 400);
        const analytics = computeTraderAnalytics(address, transfers, tokenAddress, JESSE_DECIMALS);
        const farcaster = await getFarcasterProfiles([address]);
        analytics.farcaster = farcaster.get(address) ?? null;

        return NextResponse.json({ analytics });
    } catch (error) {
        const isDev = process.env.NODE_ENV === 'development';
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        
        console.error(`GET /api/traders/${params.address} error:`, {
            message,
            stack: isDev ? stack : undefined,
            error: error instanceof Error ? error.toString() : String(error),
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to load trader analytics',
                message: isDev ? message : 'Internal server error',
                ...(isDev && stack ? { stack } : {}),
            },
            { status: 500 }
        );
    }
}

