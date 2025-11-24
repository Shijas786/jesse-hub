import { NextResponse } from 'next/server';
import { env } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
    const tokenAddress =
        process.env.JESSE_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_JESSE_TOKEN_ADDRESS;
    const gmContract =
        process.env.NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS ||
        process.env.JESSE_GM_CONTRACT_ADDRESS;
    const goldrushKey =
        process.env.GOLDRUSH_API_KEY ||
        process.env.COVALENT_KEY ||
        process.env.COVALENT_API_KEY;
    const walletConnectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

    const debug = {
        // Required backend env vars
        hasTokenAddress: !!tokenAddress,
        hasGmContract: !!gmContract,
        hasGoldrushKey: !!goldrushKey,
        hasNeynarKey: !!env.neynarKey,
        hasWalletConnectId: !!walletConnectId,
        chainId: env.chainId,
        // Masked values for security
        tokenAddress: tokenAddress
            ? `${tokenAddress.substring(0, 6)}...${tokenAddress.substring(38)}`
            : 'missing',
        gmContract: gmContract
            ? `${gmContract.substring(0, 6)}...${gmContract.substring(38)}`
            : 'missing',
        goldrushKey: goldrushKey ? `${goldrushKey.substring(0, 6)}...` : 'missing',
        neynarKey: env.neynarKey ? `${env.neynarKey.substring(0, 6)}...` : 'missing',
        walletConnectId: walletConnectId ? `${walletConnectId.substring(0, 6)}...` : 'missing',
        // Status summary
        allRequiredSet:
            !!tokenAddress && !!gmContract && !!goldrushKey && !!env.neynarKey,
        warnings: [
            !tokenAddress && 'JESSE_TOKEN_ADDRESS or NEXT_PUBLIC_JESSE_TOKEN_ADDRESS missing',
            !gmContract && 'NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS missing',
            !goldrushKey && 'GOLDRUSH_API_KEY or COVALENT_KEY missing',
            !env.neynarKey && 'NEYNAR_API_KEY missing',
            !walletConnectId && 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID missing (APKT008 warning)',
        ].filter(Boolean),
    };

    return NextResponse.json(debug);
}

