import { GoldRushClient } from '@covalenthq/client-sdk';

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

/**
 * Get token holders for JESSE token via GoldRush SDK
 */
export async function getTokenHolders(tokenAddress: string, page = 0, pageSize = 100) {
    const goldrush = getClient();

    const response = await goldrush.BalanceService.getTokenHoldersV2ForTokenAddressByPage(
        CHAIN,
        tokenAddress,
        {
            pageNumber: page,
            pageSize,
        }
    );

    if (!response.data || response.error) {
        throw new Error(response.error_message || 'Failed to fetch token holders');
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

    const response =
        await goldrush.BalanceService.getErc20TransfersForWalletAddressByPage(
            CHAIN,
            address,
            {
                contractAddress: tokenAddress,
                pageSize,
                pageNumber: 0,
            }
        );

    if (!response.data || response.error) {
        throw new Error(response.error_message || 'Failed to fetch transfers');
    }

    return response.data;
}

/**
 * Get historical token prices for JESSE
 */
export async function getTokenPrices(tokenAddress: string, fromDate?: string, toDate?: string) {
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

    if (!response.data || response.error) {
        throw new Error(response.error_message || 'Failed to fetch token prices');
    }

    const priceItems: Array<{ date: string; price: number }> = [];

    if (Array.isArray(response.data)) {
        response.data.forEach((tokenData) => {
            tokenData?.items?.forEach((item) => {
                if (item) {
                    priceItems.push({
                        date: item.date instanceof Date ? item.date.toISOString() : item.date || '',
                        price: item.price || 0,
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

    if (!response.data || response.error) {
        throw new Error(response.error_message || 'Failed to fetch balances');
    }

    const token = response.data.items?.find(
        (item) => item.contract_address?.toLowerCase() === tokenAddress.toLowerCase()
    );

    return token || null;
}

