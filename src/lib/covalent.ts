import { env, requireEnv } from './config';

const API_BASE = 'https://api.covalenthq.com/v1';

interface CovalentResponse<T> {
    data: T;
    error: boolean;
    error_message?: string;
    error_code?: number;
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

interface TokenHoldersPayload {
    items: TokenHolderItem[];
}

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

interface TransfersPayload {
    items: TransferItem[];
}

interface PriceHistoryPayload {
    items: Array<{
        date: string;
        price: number;
    }>;
}

interface BalancesPayload {
    items: Array<{
        contract_address: `0x${string}`;
        contract_decimals: number;
        balance: string;
        quote: number | null;
        quote_rate: number | null;
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

async function covalentFetch<T>(
    path: string,
    params: Record<string, string | number | boolean | undefined> = {}
) {
    const key = requireEnv('covalentKey');
    const url = new URL(`${API_BASE}/${path.replace(/^\/+/, '')}`);

    Object.entries(params).forEach(([paramKey, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(paramKey, String(value));
        }
    });

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${key}`,
        },
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        const text = await response.text();
        console.error(
            `Covalent API Error [${path}]:`,
            response.status,
            text.substring(0, 200)
        );
        throw new Error(
            `Covalent request failed: ${response.status} ${text.substring(0, 200)}`
        );
    }

    const json = (await response.json()) as CovalentResponse<T>;
    if (json.error) {
        console.error(
            `Covalent API Error [${path}]:`,
            json.error_message,
            json.error_code
        );
        throw new Error(json.error_message || `Unknown Covalent error (code: ${json.error_code})`);
    }

    return json.data;
}

/**
 * Get top token holders for the Jesse token.
 * Uses token_holders_v2 which is supported on Base.
 */
export async function getTokenHolders(pageSize = 250) {
    const chainId = env.chainId;
    const tokenAddress = requireEnv('tokenAddress');

    const data = await covalentFetch<TokenHoldersPayload>(
        `${chainId}/tokens/${tokenAddress}/token_holders_v2/`,
        {
            'page-size': pageSize,
        }
    );

    return data.items;
}

export type GmEventItem = EventPayload['items'][number];

/**
 * Get transfers for a single holder for our Jesse token.
 */
export async function getHolderTransfers(
    address: `0x${string}`,
    pageSize = 200
) {
    const chainId = env.chainId;
    const tokenAddress = requireEnv('tokenAddress');

    const data = await covalentFetch<TransfersPayload>(
        `${chainId}/address/${address}/transfers_v2/`,
        {
            'contract-address': tokenAddress,
            'page-size': pageSize,
            // IMPORTANT: do NOT use "no-logs": true here, we need item.transfers
        }
    );

    return data.items;
}

/**
 * Get token transfers for multiple addresses in parallel using transfers_v2.
 * Base does not support /tokens/{token}/token_transfers/, so we fan out by address.
 */
export async function getTokenTransfers(pageSize = 500) {
    const chainId = env.chainId;
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
}

export async function getPriceHistory(days = 30) {
    const chainId = env.chainId;
    const tokenAddress = requireEnv('tokenAddress');

    const data = await covalentFetch<PriceHistoryPayload>(
        `pricing/historical_by_addresses_v2/${chainId}/USD/${tokenAddress}/`,
        { 'page-size': days }
    );

    return data.items;
}

/**
 * GM events from JesseGM contract.
 */
export async function getGmEvents(pageSize = 200) {
    const chainId = env.chainId;
    const gmContract = requireEnv('gmContractAddress');

    const data = await covalentFetch<EventPayload>(
        `${chainId}/events/address/${gmContract}/`,
        {
            'starting-block': 1, // Base chain genesis block
            'ending-block': 'latest',
            'page-size': pageSize,
        }
    );

    return data.items;
}

export async function getAddressTokenBalance(address: `0x${string}`) {
    const chainId = env.chainId;
    const tokenAddress = requireEnv('tokenAddress');

    const data = await covalentFetch<BalancesPayload>(
        `${chainId}/address/${address}/balances_v2/`
    );

    const match = data.items.find(
        (item) =>
            item.contract_address.toLowerCase() === tokenAddress.toLowerCase()
    );

    if (!match) {
        return null;
    }

    const decimals = match.contract_decimals || 18;
    const rawBalance = Number(match.balance) / 10 ** decimals;

    return {
        balance: rawBalance,
        balanceQuote: match.quote ?? 0,
        quoteRate: match.quote_rate ?? 0,
        decimals,
    };
}
