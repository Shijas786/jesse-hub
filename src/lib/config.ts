export const env = {
    tokenAddress: process.env.NEXT_PUBLIC_JESSE_TOKEN_ADDRESS as `0x${string}` | undefined,
    gmContractAddress: process.env.NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS as `0x${string}` | undefined,
    chainId: Number(process.env.NEXT_PUBLIC_JESSE_CHAIN_ID ?? '8453'),
    covalentKey: process.env.COVALENT_API_KEY || process.env.covalentKey,
    neynarKey: process.env.NEYNAR_API_KEY || process.env.neynarKey,
};

export function requireEnv<T extends keyof typeof env>(key: T): NonNullable<(typeof env)[T]> {
    const value = env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value as NonNullable<(typeof env)[T]>;
}

export const JESSE_DECIMALS = 18;

