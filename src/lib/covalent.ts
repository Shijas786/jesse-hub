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
        decoded: {
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

async function covalentFetch<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}) {
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
        console.error(`Covalent API Error [${path}]:`, response.status, text.substring(0, 200));
        throw new Error(`Covalent request failed: ${response.status} ${text.substring(0, 200)}`);
    }

    const json = (await response.json()) as CovalentResponse<T>;
    if (json.error) {
        console.error(`Covalent API Error [${path}]:`, json.error_message, json.error_code);
        throw new Error(json.error_message || `Unknown Covalent error (code: ${json.error_code})`);
    }

    return json.data;
}

export async function getTokenHolders(pageSize = 250) {
    const chainId = env.chainId;
    const tokenAddress = requireEnv('tokenAddress');

    const data = await covalentFetch<TokenHoldersPayload>(
        `${chainId}/tokens/${tokenAddress}/token_holders/`,
        {
            'page-size': pageSize,
        }
    );

    return data.items;
}

export type GmEventItem = EventPayload['items'][number];

export async function getHolderTransfers(address: `0x${string}`, pageSize = 200) {
    const chainId = env.chainId;
    const tokenAddress = requireEnv('tokenAddress');

    const data = await covalentFetch<TransfersPayload>(
        `${chainId}/address/${address}/transfers_v2/`,
        {
            'contract-address': tokenAddress,
            'page-size': pageSize,
            'no-logs': true,
        }
    );

    return data.items;
}

export async function getTokenTransfers(pageSize = 500) {
    const chainId = env.chainId;
    const tokenAddress = requireEnv('tokenAddress');

    const data = await covalentFetch<TransfersPayload>(
        `${chainId}/tokens/${tokenAddress}/token_transfers/`,
        {
            'page-size': pageSize,
        }
    );

    return data.items;
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

export async function getGmEvents(pageSize = 200) {
    const chainId = env.chainId;
    const gmContract = requireEnv('gmContractAddress');

    const data = await covalentFetch<EventPayload>(
        `${chainId}/events/address/${gmContract}/`,
        {
            'starting-block': 0,
            'ending-block': 'latest',
            'page-size': pageSize,
        }
    );

    return data.items;
}

export async function getAddressTokenBalance(address: `0x${string}`) {
    const chainId = env.chainId;
    const tokenAddress = requireEnv('tokenAddress');

    const data = await covalentFetch<BalancesPayload>(`${chainId}/address/${address}/balances_v2/`);
    const match = data.items.find(
        (item) => item.contract_address.toLowerCase() === tokenAddress.toLowerCase()
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

