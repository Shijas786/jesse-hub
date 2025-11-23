import { GoldRushClient } from '@covalenthq/client-sdk';
import { env, requireEnv } from './config';

// Initialize the Covalent client
let client: GoldRushClient | null = null;

function getClient(): GoldRushClient {
    if (!client) {
        const apiKey = requireEnv('covalentKey');
        client = new GoldRushClient(apiKey);
    }
    return client;
}

// Chain name for Base
const BASE_CHAIN = 'base-mainnet' as const;

// Type definitions matching our existing interfaces
export interface TransferItem {
    block_signed_at: string;
    tx_hash: string;
    successful: boolean;
    from_address: `0x${string}`;
    to_address: `0x${string}`;
    value_quote: number;
    transfers: Array<{
        delta: string;
        delta_quote: number | null;
        contract_decimals: number;
        contract_address: `0x${string}`;
        transfer_type: 'IN' | 'OUT';
        to_address: `0x${string}`;
        from_address: `0x${string}`;
        log_index: number;
    }>;
}

interface TokenHolderItem {
    address: `0x${string}`;
    balance: string;
    balance_quote: number;
    quote_rate: number;
    total_supply: string;
    contract_decimals: number;
    last_transferred_at: string;
}

interface EventPayload {
    items: Array<{
        block_signed_at: string;
        tx_hash: string;
        log_events: Array<{
            decoded?: {
                name: string;
                params: Array<{
                    name: string;
                    type: string;
                    indexed: boolean;
                    decoded: boolean;
                    value: string;
                }>;
            } | null;
        }>;
    }>;
}

export type GmEventItem = EventPayload['items'][number];

/**
 * Get top token holders for the Jesse token.
 * Uses token_holders_v2 which is supported on Base.
 */
export async function getTokenHolders(pageSize = 250): Promise<TokenHolderItem[]> {
    try {
        const tokenAddress = requireEnv('tokenAddress');
        const covalent = getClient();

        // SDK only supports pageSize of 100 or 1000
        const sdkPageSize = pageSize <= 100 ? 100 : 1000;
        const pagesNeeded = Math.ceil(pageSize / sdkPageSize);

        const allHolders: TokenHolderItem[] = [];

        for (let page = 0; page < pagesNeeded && allHolders.length < pageSize; page++) {
            const response = await covalent.BalanceService.getTokenHoldersV2ForTokenAddressByPage(
                BASE_CHAIN,
                tokenAddress,
                {
                    pageSize: sdkPageSize,
                    pageNumber: page,
                }
            );

            if (!response.data || response.error) {
                throw new Error(response.error_message || 'Failed to fetch token holders');
            }

            // Map SDK response to our expected format
            const items = (response.data.items || []).map((item) => ({
                address: item.address as `0x${string}`,
                balance: item.balance?.toString() || '0',
                balance_quote: 0, // SDK doesn't provide this for holders
                quote_rate: 0, // SDK doesn't provide this for holders
                total_supply: item.total_supply?.toString() || '0',
                contract_decimals: item.contract_decimals || 18,
                last_transferred_at: '', // SDK doesn't provide this for holders
            }));

            allHolders.push(...items);
        }

        return allHolders.slice(0, pageSize);
    } catch (error) {
        console.error('getTokenHolders error:', error);
        throw error;
    }
}

/**
 * Get transfers for a single holder for our Jesse token.
 */
export async function getHolderTransfers(
    address: `0x${string}`,
    pageSize = 200
): Promise<TransferItem[]> {
    try {
        const tokenAddress = requireEnv('tokenAddress');
        const covalent = getClient();

        const response = await covalent.BalanceService.getErc20TransfersForWalletAddressByPage(
            BASE_CHAIN,
            address,
            {
                contractAddress: tokenAddress,
                startingBlock: 1,
                // endingBlock defaults to current block height if omitted
                pageSize,
                pageNumber: 0,
            }
        );

        if (!response.data || response.error) {
            throw new Error(response.error_message || 'Failed to fetch transfers');
        }

        // Map SDK response to our expected format
        return (response.data.items || []).map((item) => ({
            block_signed_at: item.block_signed_at 
                ? (item.block_signed_at instanceof Date 
                    ? item.block_signed_at.toISOString() 
                    : String(item.block_signed_at))
                : '',
            tx_hash: item.tx_hash || '',
            successful: item.successful ?? true,
            from_address: item.from_address as `0x${string}`,
            to_address: item.to_address as `0x${string}`,
            value_quote: item.value_quote || 0,
            transfers: (item.transfers || []).map((transfer) => ({
                delta: transfer.delta?.toString() || '0',
                delta_quote: transfer.delta_quote || null,
                contract_decimals: transfer.contract_decimals || 18,
                contract_address: transfer.contract_address as `0x${string}`,
                transfer_type: (transfer.transfer_type === 'transfer-in' ? 'IN' : 'OUT') as 'IN' | 'OUT',
                to_address: transfer.to_address as `0x${string}`,
                from_address: transfer.from_address as `0x${string}`,
                log_index: (transfer as any).log_index || 0,
            })),
        }));
    } catch (error) {
        console.error('getHolderTransfers error:', error);
        throw error;
    }
}

/**
 * Get token transfers for multiple addresses in parallel using transfers_v2.
 * Base does not support /tokens/{token}/token_transfers/, so we fan out by address.
 */
export async function getTokenTransfers(pageSize = 500): Promise<TransferItem[]> {
    try {
        const tokenAddress = requireEnv('tokenAddress');

        // Get top holders first (limited)
        const holders = await getTokenHolders(
            Math.min(50, Math.ceil(pageSize / 10))
        );

        const perHolder = Math.max(5, Math.ceil(pageSize / 30));
        const transferPromises = holders.slice(0, 30).map((holder) =>
            getHolderTransfers(
                holder.address.toLowerCase() as `0x${string}`,
                perHolder
            )
        );

        const allTransfers = await Promise.all(transferPromises);

        const transferMap = new Map<string, TransferItem>();

        allTransfers.flat().forEach((item) => {
            const relevant = item.transfers?.some(
                (t) =>
                    t.contract_address.toLowerCase() === tokenAddress.toLowerCase()
            );
            if (relevant) {
                transferMap.set(item.tx_hash, item);
            }
        });

        return Array.from(transferMap.values()).slice(0, pageSize);
    } catch (error) {
        console.error('getTokenTransfers error:', error);
        throw error;
    }
}

export async function getPriceHistory(days = 30) {
    try {
        const tokenAddress = requireEnv('tokenAddress');
        const covalent = getClient();

        const toDate = new Date();
        const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const response = await covalent.PricingService.getTokenPrices(
            BASE_CHAIN,
            'USD',
            tokenAddress,
            {
                from: fromDate.toISOString().split('T')[0],
                to: toDate.toISOString().split('T')[0],
            }
        );

        if (!response.data || response.error) {
            throw new Error(response.error_message || 'Failed to fetch price history');
        }

        // Map SDK response to our expected format
        // SDK returns array of TokenPricesResponse, each with items array
        const allPrices: Array<{ date: string; price: number }> = [];
        if (Array.isArray(response.data)) {
            response.data.forEach((tokenData) => {
                if (tokenData.items) {
                    tokenData.items.forEach((item) => {
                        allPrices.push({
                            date: item.date 
                                ? (item.date instanceof Date 
                                    ? item.date.toISOString().split('T')[0] 
                                    : String(item.date))
                                : '',
                            price: item.price || 0,
                        });
                    });
                }
            });
        }

        return allPrices;
    } catch (error) {
        console.error('getPriceHistory error:', error);
        throw error;
    }
}

/**
 * GM events from JesseGM contract.
 * Uses the standard getLogs endpoint (GET /v1/{chainName}/events/) which supports filtering by address.
 * Note: This endpoint doesn't support pagination, so we filter and limit results client-side.
 * For better performance with large datasets, consider using getLogEventsByAddressByPage() instead.
 */
export async function getGmEvents(pageSize = 200): Promise<GmEventItem[]> {
    try {
        const gmContract = requireEnv('gmContractAddress');
        const covalent = getClient();

        const response = await covalent.BaseService.getLogs(BASE_CHAIN, {
            startingBlock: 1, // Base chain genesis block
            endingBlock: 'latest',
            address: gmContract,
            skipDecode: false, // We need decoded events to filter for GMed events
        });

        if (!response.data || response.error) {
            throw new Error(response.error_message || 'Failed to fetch GM events');
        }

        // Map SDK response to our expected format
        // Filter for GMed events and limit to pageSize
        // Note: getLogs() returns all matching logs, so we filter client-side
        const allItems = (response.data.items || [])
            .filter((item) => item.decoded?.name === 'GMed')
            .slice(0, pageSize)
            .map((item) => ({
                block_signed_at: item.block_signed_at 
                    ? (item.block_signed_at instanceof Date 
                        ? item.block_signed_at.toISOString() 
                        : String(item.block_signed_at))
                    : '',
                tx_hash: item.tx_hash || '',
                log_events: [
                    {
                        decoded: item.decoded
                            ? {
                                  name: item.decoded.name || '',
                                  params: (item.decoded.params || []).map((param) => ({
                                      name: param.name || '',
                                      type: param.type || '',
                                      indexed: param.indexed ?? false,
                                      decoded: param.decoded ?? false,
                                      value: param.value || '',
                                  })),
                              }
                            : null,
                    },
                ],
            }));

        return allItems;
    } catch (error) {
        console.error('getGmEvents error:', error);
        throw error;
    }
}

export async function getAddressTokenBalance(address: `0x${string}`) {
    try {
        const tokenAddress = requireEnv('tokenAddress');
        const covalent = getClient();

        const response = await covalent.BalanceService.getTokenBalancesForWalletAddress(
            BASE_CHAIN,
            address
        );

        if (!response.data || response.error) {
            throw new Error(response.error_message || 'Failed to fetch token balance');
        }

        // Find the Jesse token in the balances
        const match = response.data.items?.find(
            (item) =>
                item.contract_address?.toLowerCase() === tokenAddress.toLowerCase()
        );

        if (!match) {
            return null;
        }

        const decimals = match.contract_decimals || 18;
        const rawBalance = Number(match.balance || 0) / 10 ** decimals;

        return {
            balance: rawBalance,
            balanceQuote: match.quote || 0,
            quoteRate: match.quote_rate || 0,
            decimals,
        };
    } catch (error) {
        console.error('getAddressTokenBalance error:', error);
        throw error;
    }
}
