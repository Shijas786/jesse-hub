import { NextResponse } from 'next/server';
import { getTokenHolders } from '@/lib/goldrush';
import { requireEnv } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '0', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '100', 10);

        const jesseToken = requireEnv('tokenAddress');
        const data = await getTokenHolders(jesseToken, page, pageSize);

        // Normalize for frontend
        const holders = (data.items || []).map((item: any) => {
            const balanceRaw = BigInt(item.balance || '0');
            const decimals = item.contract_decimals || 18;
            const balance = Number(balanceRaw) / 10 ** decimals;
            const totalSupplyRaw = BigInt(item.total_supply || '0');
            const totalSupply = Number(totalSupplyRaw) / 10 ** decimals;
            const pct = totalSupply > 0 ? (balance / totalSupply) * 100 : 0;

            return {
                address: item.address,
                balance,
                balanceRaw: item.balance,
                pct,
                contractDecimals: decimals,
                contractName: item.contract_name,
                contractTicker: item.contract_ticker_symbol,
            };
        });

        return NextResponse.json({
            holders,
            pagination: data.pagination || {
                page_number: page,
                page_size: pageSize,
                total_count: holders.length,
            },
        });
    } catch (error: any) {
        console.error('Error fetching top holders:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch top holders' },
            { status: 500 }
        );
    }
}

