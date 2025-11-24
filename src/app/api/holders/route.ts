import { NextResponse } from 'next/server';
import { GoldRushClient } from '@covalenthq/client-sdk';
import { requireEnv } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const apiKey = process.env.GOLDRUSH_API_KEY || process.env.COVALENT_KEY || process.env.COVALENT_API_KEY;
        if (!apiKey) {
            throw new Error('Missing GOLDRUSH_API_KEY or COVALENT_KEY');
        }

        const client = new GoldRushClient(apiKey);
        const tokenAddress = requireEnv('tokenAddress');

        const resp = await client.BalanceService.getTokenHoldersV2ForTokenAddressByPage(
            'base-mainnet',
            tokenAddress,
            {
                pageSize: 100,
                pageNumber: 0,
            }
        );

        if (!resp.data || resp.error) {
            throw new Error(resp.error_message || 'Failed to fetch holders');
        }

        // Map to expected format
        const holders = (resp.data.items || []).map((item) => ({
            address: item.address,
            balance: item.balance?.toString() || '0',
            balance_quote: 0, // Not provided by holders endpoint
            quote_rate: 0,
            total_supply: item.total_supply?.toString() || '0',
            contract_decimals: item.contract_decimals || 18,
            last_transferred_at: '', // Not provided by holders endpoint
        }));

        // Calculate stats
        const totalHolders = resp.data.pagination?.total_count || holders.length;
        const totalSupply = holders.length > 0 
            ? Number(BigInt(holders[0].total_supply) / BigInt(10 ** (holders[0].contract_decimals || 18)))
            : 0;
        const topHolderBalance = holders.length > 0
            ? Number(BigInt(holders[0].balance) / BigInt(10 ** (holders[0].contract_decimals || 18)))
            : 0;

        return NextResponse.json({
            holders,
            stats: {
                totalHolders,
                totalSupply,
                topHolder: topHolderBalance,
            },
            pagination: resp.data.pagination,
        });
    } catch (error) {
        const isDev = process.env.NODE_ENV === 'development';
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        
        console.error('GET /api/holders error:', {
            message,
            stack: isDev ? stack : undefined,
            error: error instanceof Error ? error.toString() : String(error),
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to load holders',
                message: isDev ? message : 'Internal server error',
                ...(isDev && stack ? { stack } : {}),
            },
            { status: 500 }
        );
    }
}
