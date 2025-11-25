import { NextResponse } from 'next/server';
import { getClient } from '@/lib/goldrush';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test if we can instantiate the client
        const apiKey =
            process.env.GOLDRUSH_API_KEY ||
            process.env.COVALENT_KEY ||
            process.env.COVALENT_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                error: 'Missing API key',
                hasGOLDRUSH_API_KEY: !!process.env.GOLDRUSH_API_KEY,
                hasCOVALENT_KEY: !!process.env.COVALENT_KEY,
                hasCOVALENT_API_KEY: !!process.env.COVALENT_API_KEY,
            });
        }

        const { GoldRushClient } = await import('@covalenthq/client-sdk');
        const client = new GoldRushClient(apiKey);

        // Test a simple call
        const tokenAddress =
            process.env.JESSE_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_JESSE_TOKEN_ADDRESS;

        if (!tokenAddress) {
            return NextResponse.json({
                error: 'Missing token address',
                hasJESSE_TOKEN_ADDRESS: !!process.env.JESSE_TOKEN_ADDRESS,
                hasNEXT_PUBLIC_JESSE_TOKEN_ADDRESS: !!process.env.NEXT_PUBLIC_JESSE_TOKEN_ADDRESS,
            });
        }

        // Test getTokenHoldersV2ForTokenAddress
        const iterator = client.BalanceService.getTokenHoldersV2ForTokenAddress(
            'base-mainnet',
            tokenAddress.toLowerCase(),
            {
                pageNumber: 0,
                pageSize: 10,
            }
        );

        // Try to get first page
        let firstPage: any = null;
        let error: any = null;

        try {
            for await (const page of iterator) {
                firstPage = page;
                break;
            }
        } catch (e) {
            error = e;
        }

        return NextResponse.json({
            success: !error && !!firstPage,
            error: error ? String(error) : null,
            hasData: !!firstPage?.data,
            hasError: !!firstPage?.error,
            errorMessage: firstPage?.error_message || null,
            itemsCount: firstPage?.data?.items?.length || 0,
            apiKeyPrefix: apiKey.substring(0, 6),
            tokenAddress: tokenAddress.substring(0, 10) + '...',
        });
    } catch (err: any) {
        return NextResponse.json({
            error: err.message || String(err),
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
    }
}

