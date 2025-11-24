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

/**
 * Legacy TokenHolderItem format (for compatibility with holder detail routes)
 */
export interface TokenHolderItem {
    address: `0x${string}`;
    balance: string;
    balance_quote: number;
    quote_rate: number;
    total_supply: string;
    contract_decimals: number;
    last_transferred_at: string;
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
 * Returns new format (for /api/holders).
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
 * Get token holders in legacy format (for holder detail routes).
 */
export async function getTokenHoldersLegacy(
    pageSize = 250
): Promise<TokenHolderItem[]> {
    const tokenAddress =
        process.env.JESSE_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_JESSE_TOKEN_ADDRESS;
    if (!tokenAddress) {
        throw new Error('Missing JESSE_TOKEN_ADDRESS environment variable');
    }

    const goldrush = getClient();
    const sdkPageSize = pageSize <= 100 ? 100 : 1000;
    const pagesNeeded = Math.ceil(pageSize / sdkPageSize);
    const allHolders: TokenHolderItem[] = [];

    const iterator = goldrush.BalanceService.getTokenHoldersV2ForTokenAddress(
        CHAIN,
        tokenAddress.toLowerCase(),
        {
            pageSize: sdkPageSize,
            pageNumber: 0,
        }
    );

    let processedPages = 0;
    for await (const response of iterator) {
        if (processedPages >= pagesNeeded || allHolders.length >= pageSize) {
            break;
        }

        if (!response || response.error || !response.data) {
            throw new Error(response?.error_message || 'Failed to fetch token holders');
        }

        const items = (response.data.items || []).map((item: any) => ({
            address: item.address.toLowerCase() as `0x${string}`,
            balance: item.balance?.toString() || '0',
            balance_quote: 0,
            quote_rate: 0,
            total_supply: item.total_supply?.toString() || '0',
            contract_decimals: item.contract_decimals || 18,
            last_transferred_at: '',
        }));

        allHolders.push(...items);
        processedPages++;
    }

    if (!allHolders.length) {
        throw new Error('No holder data returned from GoldRush');
    }

    return allHolders.slice(0, pageSize);
}

/**
 * Transfer item type (matches legacy Covalent format for compatibility)
 */
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

/**
 * Get ERC20 transfers for a wallet and then filter for the specific token.
 * Returns format compatible with legacy Covalent TransferItem[].
 */
export async function getHolderTransfers(
    walletAddress: string,
    tokenAddress: string,
    pageSize = 200
): Promise<TransferItem[]> {
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

    // Map SDK response to legacy TransferItem format
    return (resp.data.items || [])
        .filter(
            (item: any) =>
                item.contract_address &&
                item.contract_address.toLowerCase() === tokenAddress.toLowerCase()
        )
        .map((item: any) => ({
            block_signed_at: item.block_signed_at
                ? item.block_signed_at instanceof Date
                    ? item.block_signed_at.toISOString()
                    : String(item.block_signed_at)
                : '',
            tx_hash: item.tx_hash || '',
            successful: item.successful ?? true,
            from_address: item.from_address as `0x${string}`,
            to_address: item.to_address as `0x${string}`,
            value_quote: item.value_quote || 0,
            transfers: (item.transfers || []).map((transfer: any) => ({
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
}

/**
 * Get ERC20 transfers for a wallet and then filter for the specific token.
 * Returns raw GoldRush format (for trader analytics).
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
 * Returns raw GoldRush format (for trader analytics).
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
 * Get token balance (and quote) for a specific wallet + token.
 * Returns format compatible with legacy Covalent (for holder detail routes).
 */
export async function getAddressTokenBalance(
    walletAddress: string,
    tokenAddress: string
) {
    const token = await getTokenBalanceForAddress(walletAddress, tokenAddress);
    if (!token) {
        return null;
    }

    const decimals = token.contract_decimals || 18;
    const rawBalance = Number(token.balance || 0) / 10 ** decimals;

    return {
        balance: rawBalance,
        balanceQuote: token.quote || 0,
        quoteRate: token.quote_rate || 0,
        decimals,
    };
}

/**
 * GM event item type (matches legacy Covalent format for compatibility)
 */
export interface GmEventItem {
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
}

/**
 * Get GM events from JesseGM contract.
 * Uses GoldRush BaseService.getLogEventsByAddressByPage.
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
            startingBlock: 1, // Base chain genesis block
            endingBlock: 'latest',
            pageSize,
            pageNumber: 0,
        }
    );

    if (!resp.data || resp.error) {
        throw new Error(resp.error_message || 'Failed to fetch GM events');
    }

    // Map SDK response to expected format
    // Filter for GMed events (in case there are other events from the contract)
    const allItems = (resp.data.items || [])
        .filter((item) => item.decoded?.name === 'GMed')
        .map((item) => ({
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
}
