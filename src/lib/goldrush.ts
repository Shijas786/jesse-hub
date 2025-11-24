import { GoldRushClient, type GoldRushResponse } from '@covalenthq/client-sdk';

const CHAIN = 'base-mainnet';

let client: GoldRushClient | null = null;

function getClient() {
    if (!client) {
        const apiKey =
            process.env.GOLDRUSH_API_KEY ||
            process.env.COVALENT_KEY ||
            process.env.COVALENT_API_KEY;

        if (!apiKey) {
            throw new Error('Missing GOLDRUSH_API_KEY or COVALENT_KEY environment variable');
        }

        client = new GoldRushClient(apiKey);
    }

    return client;
}

async function getFirstPage<T>(iterable: AsyncIterable<GoldRushResponse<T>>) {
    for await (const page of iterable) {
        return page;
    }
    throw new Error('GoldRush API returned no data');
}

/**
 * Get token holders for JESSE token via GoldRush SDK
 */
export async function getTokenHolders(tokenAddress: string, page = 0, pageSize = 100) {
    const goldrush = getClient();

    const response = await getFirstPage(
        goldrush.BalanceService.getTokenHoldersV2ForTokenAddress(CHAIN, tokenAddress, {
            pageNumber: page,
            pageSize,
        })
    );

    if (!response || response.error || !response.data) {
        throw new Error(response?.error_message || 'GoldRush API failure (holders)');
    }

    return response.data;
}

/**
 * Get JESSE token transfers for a specific address
 */
export async function getJesseTransfersForAddress(
    address: string,
    tokenAddress: string,
    pageSize = 200
) {
    const goldrush = getClient();

    const response = await getFirstPage(
        goldrush.BalanceService.getErc20TransfersForWalletAddress(CHAIN, address, {
            contractAddress: tokenAddress,
            pageSize,
            pageNumber: 0,
        })
    );

    if (!response || response.error || !response.data) {
        throw new Error(response?.error_message || 'GoldRush API failure (transfers)');
    }

    return response.data;
}

/**
 * Get historical token prices for JESSE
 */
export interface TokenPricePoint {
    tokenAddress: string;
    price: number;
    timestamp: number;
    date: string;
}

export async function getTokenPrices(
    tokenAddress: string,
    fromDate?: string,
    toDate?: string
): Promise<TokenPricePoint[]> {
    const goldrush = getClient();
    const to = toDate || new Date().toISOString().split('T')[0];
    const from =
        fromDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await goldrush.PricingService.getTokenPrices(
        CHAIN,
        'USD',
        tokenAddress,
        {
            from,
            to,
        }
    );

    if (!response || response.error || !response.data) {
        throw new Error(response?.error_message || 'GoldRush API failure (pricing)');
    }

    const priceItems: TokenPricePoint[] = [];

    if (Array.isArray(response.data)) {
        response.data.forEach((tokenData) => {
            tokenData?.items?.forEach((item) => {
                if (item) {
                    const isoDate =
                        item.date instanceof Date ? item.date.toISOString() : item.date || '';
                    const timestamp = isoDate ? new Date(isoDate).getTime() : Date.now();

                    priceItems.push({
                        tokenAddress,
                        date: isoDate,
                        price: item.price || 0,
                        timestamp,
                    });
                }
            });
        });
    }

    return priceItems;
}

/**
 * Get token balance for a specific address
 */
export async function getTokenBalanceForAddress(address: string, tokenAddress: string) {
    const goldrush = getClient();

    const response = await goldrush.BalanceService.getTokenBalancesForWalletAddress(
        CHAIN,
        address
    );

    if (!response || response.error || !response.data) {
        throw new Error(response?.error_message || 'GoldRush API failure (balances)');
    }

    const token = response.data.items?.find(
        (item) => item.contract_address?.toLowerCase() === tokenAddress.toLowerCase()
    );

    return token || null;
}

