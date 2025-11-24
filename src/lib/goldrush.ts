import { GoldRushClient } from '@covalenthq/client-sdk';

const CHAIN = 'base-mainnet';

// Type definitions
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

/**
 * Get ERC20 transfers for a wallet (no token filter)
 */
export async function getHolderTransfers(
    address: string,
    pageSize = 200
): Promise<TransferItem[]> {
    const goldrush = getClient();

    const iterator = goldrush.BalanceService.getErc20TransfersForWalletAddress(
        CHAIN,
        address,
        {
            startingBlock: 1,
            pageSize,
            pageNumber: 0,
        }
    );
    const resp = (await takeFirst(iterator)) as any;

    if (!resp.data || resp.error) {
        throw new Error(resp.error_message || 'Failed to fetch transfers');
    }

    // Map SDK response to expected format
    return (resp.data.items || []).map((item: any) => ({
        block_signed_at: item.block_signed_at
            ? item.block_signed_at instanceof Date
                ? item.block_signed_at.toISOString()
                : String(item.block_signed_at)
            : '',
        tx_hash: item.tx_hash || '',
        successful: item.successful ?? true,
        from_address: item.from_address,
        to_address: item.to_address,
        value_quote: item.value_quote || 0,
        transfers: (item.transfers || []).map((transfer: any) => ({
            delta: transfer.delta?.toString() || '0',
            delta_quote: transfer.delta_quote || null,
            contract_decimals: transfer.contract_decimals || 18,
            contract_address: transfer.contract_address,
            transfer_type:
                transfer.transfer_type === 'transfer-in' ? 'IN' : 'OUT',
            to_address: transfer.to_address,
            from_address: transfer.from_address,
            log_index: (transfer as any).log_index || 0,
        })),
    }));
}

/**
 * GM events from JesseGM contract
 */
export async function getGmEvents(
    gmContractAddress: string,
    pageSize = 200
): Promise<GmEventItem[]> {
    const goldrush = getClient();

    const resp = await goldrush.BaseService.getLogEventsByAddressByPage(
        CHAIN,
        gmContractAddress,
        {
            startingBlock: 1,
            endingBlock: 'latest',
            pageSize,
            pageNumber: 0,
        }
    );

    if (!resp.data || resp.error) {
        throw new Error(resp.error_message || 'Failed to fetch GM events');
    }

    // Map SDK response + filter for GMed events
    const allItems = (resp.data.items || [])
        .filter((item: any) => item.decoded?.name === 'GMed')
        .map((item: any) => ({
            block_signed_at: item.block_signed_at
                ? item.block_signed_at instanceof Date
                    ? item.block_signed_at.toISOString()
                    : String(item.block_signed_at)
                : '',
            tx_hash: item.tx_hash || '',
            log_events: [
                {
                    decoded: item.decoded
                        ? {
                              name: item.decoded.name || '',
                              params: (item.decoded.params || []).map((param: any) => ({
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
}

/**
 * Get address token balance with formatted output
 */
export async function getAddressTokenBalance(
    address: string,
    tokenAddress: string
) {
    const goldrush = getClient();

    const resp = await goldrush.BalanceService.getTokenBalancesForWalletAddress(
        CHAIN,
        address
    );

    if (!resp.data || resp.error) {
        throw new Error(resp.error_message || 'Failed to fetch token balance');
    }

    // Find the target token in the balances
    const match = (resp.data.items || []).find(
        (item: any) =>
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
}

/**
 * Get token transfers for multiple addresses in parallel (for lib/server/holders)
 */
export async function getTokenTransfers(
    tokenAddress: string,
    pageSize = 500
): Promise<TransferItem[]> {
    const holdersData = await getTokenHolders(tokenAddress, 0, Math.min(50, Math.ceil(pageSize / 10)));
    const holders = holdersData.items || [];

    const perHolder = Math.max(5, Math.ceil(pageSize / 30));
    const transferPromises = holders.slice(0, 30).map((holder) =>
        getHolderTransfers(holder.address.toLowerCase(), perHolder)
    );

    const allTransfers = await Promise.all(transferPromises);
    const transferMap = new Map<string, TransferItem>();

    allTransfers.flat().forEach((item) => {
        const relevant = item.transfers?.some(
            (t) => t.contract_address.toLowerCase() === tokenAddress.toLowerCase()
        );
        if (relevant) {
            transferMap.set(item.tx_hash, item);
        }
    });

    return Array.from(transferMap.values()).slice(0, pageSize);
}
