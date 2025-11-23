import { NextResponse } from 'next/server';
import { env } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
    const debug = {
        hasTokenAddress: !!env.tokenAddress,
        hasGmContract: !!env.gmContractAddress,
        hasCovalentKey: !!env.covalentKey,
        hasNeynarKey: !!env.neynarKey,
        chainId: env.chainId,
        tokenAddress: env.tokenAddress ? `${env.tokenAddress.substring(0, 6)}...${env.tokenAddress.substring(38)}` : 'missing',
        gmContract: env.gmContractAddress ? `${env.gmContractAddress.substring(0, 6)}...${env.gmContractAddress.substring(38)}` : 'missing',
        covalentKey: env.covalentKey ? `${env.covalentKey.substring(0, 6)}...` : 'missing',
        neynarKey: env.neynarKey ? `${env.neynarKey.substring(0, 6)}...` : 'missing',
    };

    return NextResponse.json(debug);
}

