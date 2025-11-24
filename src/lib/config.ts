export const env = {
    tokenAddress: process.env.NEXT_PUBLIC_JESSE_TOKEN_ADDRESS as `0x${string}` | undefined,
    gmContractAddress: process.env.NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS as `0x${string}` | undefined,
    chainId: Number(process.env.NEXT_PUBLIC_JESSE_CHAIN_ID ?? '8453'),
    covalentKey: process.env.GOLDRUSH_API_KEY || process.env.COVALENT_KEY || process.env.COVALENT_API_KEY || process.env.covalentKey,
    neynarKey: process.env.NEYNAR_API_KEY || process.env.neynarKey,
};

export function requireEnv<T extends keyof typeof env>(key: T): NonNullable<(typeof env)[T]> {
    const value = env[key];
    if (!value) {
        const envVarNames: Record<keyof typeof env, string> = {
            tokenAddress: 'NEXT_PUBLIC_JESSE_TOKEN_ADDRESS',
            gmContractAddress: 'NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS',
            chainId: 'NEXT_PUBLIC_JESSE_CHAIN_ID',
            covalentKey: 'GOLDRUSH_API_KEY or COVALENT_KEY or COVALENT_API_KEY',
            neynarKey: 'NEYNAR_API_KEY',
        };
        throw new Error(
            `Missing environment variable: ${envVarNames[key] || key}. ` +
            `Please set it in Vercel Environment Variables.`
        );
    }
    return value as NonNullable<(typeof env)[T]>;
}

export const JESSE_DECIMALS = 18;

