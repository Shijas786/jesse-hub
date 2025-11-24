/**
 * GoldRush API helper functions for Jesse Hub
 * 
 * Following Base chain documentation: https://goldrush.dev/docs/chains/base
 * All functions use the official GoldRush REST API endpoints
 */

const BASE_URL = 'https://api.covalenthq.com/v1';
const CHAIN = 'base-mainnet';

function getApiKey(): string {
    const key = process.env.GOLDRUSH_API_KEY || process.env.COVALENT_KEY || process.env.COVALENT_API_KEY;
    if (!key) {
        throw new Error('Missing GOLDRUSH_API_KEY or COVALENT_KEY environment variable');
    }
    return key;
}

/**
 * Get token holders for JESSE token
 * Uses token_holders_v2 endpoint as per Base documentation
 */
export async function getTokenHolders(tokenAddress: string, page = 0, pageSize = 100) {
    const key = getApiKey();
    const url = `${BASE_URL}/${CHAIN}/tokens/${tokenAddress}/token_holders_v2/` +
                `?key=${key}&page-number=${page}&page-size=${pageSize}`;

    const res = await fetch(url);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GoldRush error: ${res.status} ${errorText.substring(0, 200)}`);
    }

    const json = await res.json();
    return json.data;
}

/**
 * Get JESSE token transfers for a specific address
 * Uses transfers_v3 endpoint (or transfers_v2 if v3 not available)
 */
export async function getJesseTransfersForAddress(address: string, tokenAddress: string) {
    const key = getApiKey();
    
    // Try transfers_v3 first, fallback to transfers_v2
    let url = `${BASE_URL}/${CHAIN}/address/${address}/transfers_v3/` +
              `?key=${key}&contract-address=${tokenAddress}`;
    
    let res = await fetch(url);
    
    // If v3 fails, try v2
    if (!res.ok) {
        url = `${BASE_URL}/${CHAIN}/address/${address}/transfers_v2/` +
              `?key=${key}&contract-address=${tokenAddress}`;
        res = await fetch(url);
    }
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GoldRush error: ${res.status} ${errorText.substring(0, 200)}`);
    }

    const json = await res.json();
    return json.data;
}

/**
 * Get historical token prices for JESSE
 * Used for computing PnL at trade time
 */
export async function getTokenPrices(tokenAddress: string, fromDate?: string, toDate?: string) {
    const key = getApiKey();
    const to = toDate || new Date().toISOString().split('T')[0];
    const from = fromDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const url = `${BASE_URL}/pricing/historical_by_addresses_v2/${CHAIN}/USD/${tokenAddress}/` +
                `?key=${key}&from=${from}&to=${to}`;

    const res = await fetch(url);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GoldRush error: ${res.status} ${errorText.substring(0, 200)}`);
    }

    const json = await res.json();
    return json.data;
}

/**
 * Get token balance for a specific address
 */
export async function getTokenBalanceForAddress(address: string, tokenAddress: string) {
    const key = getApiKey();
    const url = `${BASE_URL}/${CHAIN}/address/${address}/balances_v2/` +
                `?key=${key}`;

    const res = await fetch(url);
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GoldRush error: ${res.status} ${errorText.substring(0, 200)}`);
    }

    const json = await res.json();
    const token = json.data.items?.find(
        (item: any) => item.contract_address?.toLowerCase() === tokenAddress.toLowerCase()
    );
    
    return token || null;
}

