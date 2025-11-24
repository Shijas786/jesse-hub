import { NextResponse } from 'next/server';
import { getTokenHolders } from '@/lib/goldrush';

export const dynamic = 'force-dynamic';

const JESSE_TOKEN_ADDRESS =
    process.env.JESSE_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_JESSE_TOKEN_ADDRESS;

export async function GET() {
    try {
        if (!JESSE_TOKEN_ADDRESS) {
            console.error('[HOLDERS] Missing JESSE_TOKEN_ADDRESS env var');
            return NextResponse.json(
                {
                    error: 'Config error',
                    message: 'Missing JESSE_TOKEN_ADDRESS environment variable',
                },
                { status: 500 }
            );
        }

        const data = await getTokenHolders(JESSE_TOKEN_ADDRESS.toLowerCase(), 0, 100);
        const holders = data.items || [];

        const decimals = holders[0]?.contract_decimals ?? 18;
        const totalSupplyRaw = holders[0]?.total_supply;
        const topHolderBalanceRaw = holders[0]?.balance;

        const totalSupply =
            totalSupplyRaw != null
                ? Number(BigInt(totalSupplyRaw) / BigInt(10 ** decimals))
                : 0;

        const topHolder =
            topHolderBalanceRaw != null
                ? Number(BigInt(topHolderBalanceRaw) / BigInt(10 ** decimals))
                : 0;

        const totalHolders =
            data.pagination?.total_count != null
                ? data.pagination.total_count
                : holders.length;

        return NextResponse.json({
            holders,
            stats: {
                totalHolders,
                totalSupply,
                topHolder,
            },
            pagination: data.pagination,
        });
    } catch (err) {
        const isDev = process.env.NODE_ENV === 'development';
        const message = err instanceof Error ? err.message : String(err);

        console.error('GET /api/holders error:', message, err);

        return NextResponse.json(
            {
                error: 'Failed to load holders',
                message: isDev ? message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
