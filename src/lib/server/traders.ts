import {
    getTokenHolders,
    getJesseTransfersForAddress,
    getTokenBalanceForAddress,
    TokenHoldersResult,
} from '../goldrush';

const JESSE_TOKEN_ADDRESS =
    process.env.JESSE_TOKEN_ADDRESS || process.env.NEXT_PUBLIC_JESSE_TOKEN_ADDRESS;

if (!JESSE_TOKEN_ADDRESS) {
    throw new Error(
        'Missing JESSE_TOKEN_ADDRESS or NEXT_PUBLIC_JESSE_TOKEN_ADDRESS environment variable'
    );
}

export interface TraderAnalytics {
    address: string;
    totalBuyQuote: number;
    totalSellQuote: number;
    realizedProfit: number;
    currentValue: number;
    grossPnl: number;
    tradeCount: number;
    scalperScore: number;
    totalBuys: number;
}

export async function fetchTraderAnalytics(holderLimit = 50): Promise<TraderAnalytics[]> {
    const tokenAddress = JESSE_TOKEN_ADDRESS!.toLowerCase();

    const holdersResp: TokenHoldersResult = await getTokenHolders(tokenAddress, 0, holderLimit);
    const holderItems = holdersResp.items || [];
    const addresses = holderItems
        .map((h) => h.address)
        .filter(Boolean)
        .map((a) => a.toLowerCase());

    const analytics = await Promise.all(
        addresses.map(async (address) => {
            const transfersResp = await getJesseTransfersForAddress(address, tokenAddress, 200);
            const transfers = transfersResp.items || [];

            let totalBuyQuote = 0;
            let totalSellQuote = 0;
            let volume = 0;

            for (const tx of transfers) {
                const from = (tx.from_address || '').toLowerCase();
                const to = (tx.to_address || '').toLowerCase();
                const vqRaw = tx.value_quote ?? tx.delta_quote ?? 0;
                const valueQuote = Number(vqRaw) || 0;

                if (!valueQuote) continue;
                volume += Math.abs(valueQuote);

                if (to === address) {
                    totalBuyQuote += valueQuote;
                } else if (from === address) {
                    totalSellQuote += valueQuote;
                }
            }

            const balanceItem = await getTokenBalanceForAddress(address, tokenAddress);
            const currentValue = balanceItem?.quote ? Number(balanceItem.quote) : 0;

            const realizedProfit = totalSellQuote - totalBuyQuote;
            const grossPnl = realizedProfit + currentValue;

            const tradeCount = transfers.length;
            const scalperScore = tradeCount > 0 ? tradeCount * Math.log10(volume + 10) : 0;

            const analyticsRow: TraderAnalytics = {
                address,
                totalBuyQuote,
                totalSellQuote,
                realizedProfit,
                currentValue,
                grossPnl,
                tradeCount,
                scalperScore,
                totalBuys: totalBuyQuote,
            };

            return analyticsRow;
        })
    );

    analytics.sort((a, b) => b.grossPnl - a.grossPnl);

    return analytics;
}
