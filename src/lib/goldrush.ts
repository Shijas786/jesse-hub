import { GoldRushClient } from '@covalenthq/client-sdk';

const CHAIN = 'base-mainnet';

let client: GoldRushClient | null = null;

function getClient(): GoldRushClient {
    if (client) return client;

    const apiKey =
        process.env.GOLDRUSH_API_KEY ||
        process.env.COVALENT_KEY ||
        process.env.COVALENT_API_KEY;

    if (!apiKey) {
        throw new Error(
            'Missing GoldRush API key. Set GOLDRUSH_API_KEY or COVALENT_KEY or COVALENT_API_KEY.'
        );
    }

    client = new GoldRushClient(apiKey);
    return client;
}

async function takeFirst<T>(value: any): Promise<T> {
    if (value && typeof value[Symbol.asyncIterator] === 'function') {
        for await (const page of value as AsyncIterable<T>) {
            return page;
        }
        throw new Error('GoldRush API returned no data');
    }
    return value as T;
}

export interface TokenHolder {
    address: string;
    balance: string;
    total_supply?: string;
    contract_decimals: number;
    contract_ticker_symbol?: string;
    last_transferred_at?: string | null;
}

export interface TokenHoldersResult {
    items: TokenHolder[];
    pagination?: {
        has_more: boolean;
        page_number: number;
        page_size: number;
        total_count: number;
    };
}

/**
 * Get token holders for a given ERC20 token on Base.
 */
export async function getTokenHolders(
    tokenAddress: string,
    pageNumber = 0,
    pageSize = 100
): Promise<TokenHoldersResult> {
    const goldrush = getClient();

    const iterator = goldrush.BalanceService.getTokenHoldersV2ForTokenAddress(
        CHAIN,
        tokenAddress,
        {
            pageNumber,
            pageSize,
        }
    );
    const resp = (await takeFirst(iterator)) as any;

    if (!resp.data || resp.error) {
        throw new Error(resp.error_message || 'Failed to fetch token holders');
    }

    const data = resp.data as any;

    return {
        items: data.items || [],
        pagination: data.pagination,
    };
}

/**
 * Get ERC20 transfers for a wallet and then filter for the specific token.
 */
export async function getJesseTransfersForAddress(
    walletAddress: string,
    tokenAddress: string,
    pageSize = 200
) {
    const goldrush = getClient();

    const iterator = goldrush.BalanceService.getErc20TransfersForWalletAddress(
        CHAIN,
        walletAddress,
        {
            contractAddress: tokenAddress,
            pageSize,
            pageNumber: 0,
        }
    );
    const resp = (await takeFirst(iterator)) as any;

    if (!resp.data || resp.error) {
        throw new Error(resp.error_message || 'Failed to fetch transfers');
    }

    const data = resp.data as any;
    const items = (data.items || []).filter(
        (item: any) =>
            item.contract_address &&
            item.contract_address.toLowerCase() === tokenAddress.toLowerCase()
    );

    return {
        ...data,
        items,
    };
}

/**
 * Get token balance (and quote) for a specific wallet + token.
 */
export async function getTokenBalanceForAddress(
    walletAddress: string,
    tokenAddress: string
) {
    const goldrush = getClient();

    const resp = await goldrush.BalanceService.getTokenBalancesForWalletAddress(
        CHAIN,
        walletAddress
    );

    if (!resp.data || resp.error) {
        throw new Error(resp.error_message || 'Failed to fetch balances');
    }

    const data = resp.data as any;
    const token = (data.items || []).find(
        (item: any) =>
            item.contract_address &&
            item.contract_address.toLowerCase() === tokenAddress.toLowerCase()
    );

    return token || null;
}
