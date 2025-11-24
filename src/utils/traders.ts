import { TransferItem } from '@/lib/goldrush';
import { TraderAnalytics, TraderTrade } from '@/types';
import { deriveBadges } from './badges';

const HOURS_IN_MS = 1000 * 60 * 60;

const toNumber = (value: string | number | null | undefined, decimals = 18) => {
    if (value === null || value === undefined) return 0;
    const num = typeof value === 'string' ? Number(value) : value;
    return num / 10 ** decimals;
};

export function computeTraderAnalytics(
    address: `0x${string}`,
    transfers: TransferItem[],
    tokenAddress: `0x${string}`,
    decimals: number
): TraderAnalytics {
    const normalizedAddress = address.toLowerCase();
    const tokenLower = tokenAddress.toLowerCase();

    const trades: TraderTrade[] = [];
    let lastBuyTime: string | null = null;

    transfers.forEach((item) => {
        item.transfers
            ?.filter((transfer) => transfer.contract_address.toLowerCase() === tokenLower)
            .forEach((transfer) => {
                const amount = Math.abs(Number(transfer.delta)) / 10 ** decimals;
                const value = Math.abs(transfer.delta_quote ?? 0);
                if (!amount || !value) {
                    return;
                }

                const direction: 'buy' | 'sell' =
                    transfer.to_address.toLowerCase() === normalizedAddress ? 'buy' : 'sell';

                const trade: TraderTrade = {
                    hash: item.tx_hash,
                    timestamp: item.block_signed_at,
                    direction,
                    amount,
                    value,
                    price: amount > 0 ? value / amount : 0,
                    holdingHours: 0,
                };

                if (direction === 'buy') {
                    lastBuyTime = item.block_signed_at;
                } else if (lastBuyTime) {
                    const diff =
                        (new Date(item.block_signed_at).getTime() - new Date(lastBuyTime).getTime()) /
                        HOURS_IN_MS;
                    trade.holdingHours = Math.max(0, diff);
                    lastBuyTime = null;
                }

                trades.push(trade);
            });
    });

    const buyTrades = trades.filter((trade) => trade.direction === 'buy');
    const sellTrades = trades.filter((trade) => trade.direction === 'sell');
    const totalBuys = buyTrades.reduce((acc, trade) => acc + trade.amount, 0);
    const totalSells = sellTrades.reduce((acc, trade) => acc + trade.amount, 0);
    const buyValue = buyTrades.reduce((acc, trade) => acc + trade.value, 0);
    const sellValue = sellTrades.reduce((acc, trade) => acc + trade.value, 0);
    const realizedProfit = sellValue - buyValue;
    const avgEntry = totalBuys ? buyValue / totalBuys : 0;
    const avgExit = totalSells ? sellValue / totalSells : 0;

    let winTrades = 0;
    let currentStreak = 0;
    let maxWinStreak = 0;
    let lossStreak = 0;
    let maxLossStreak = 0;

    sellTrades.forEach((trade) => {
        const profitable = trade.price >= avgEntry;
        if (profitable) {
            winTrades++;
            currentStreak++;
            maxWinStreak = Math.max(maxWinStreak, currentStreak);
            lossStreak = 0;
        } else {
            lossStreak++;
            maxLossStreak = Math.max(maxLossStreak, lossStreak);
            currentStreak = 0;
        }
    });

    const winRate = sellTrades.length ? (winTrades / sellTrades.length) * 100 : 0;
    const scalperScore = trades.filter(
        (trade) => trade.direction === 'sell' && trade.holdingHours > 0 && trade.holdingHours <= 6
    ).length;
    const rektScore = realizedProfit < 0 ? Math.abs(realizedProfit) : 0;
    const diamondHandScore = Math.max(0, totalBuys - totalSells) * 10 - totalSells * 2 + scalperScore;

    const badges = deriveBadges({
        tradeCount: trades.length,
        realizedProfit,
        hasSold: sellTrades.length > 0,
    });

    return {
        address,
        totalBuys,
        totalSells,
        buyValue,
        sellValue,
        realizedProfit,
        winRate,
        scalperScore,
        rektScore,
        diamondHandScore,
        avgEntry,
        avgExit,
        winStreak: maxWinStreak,
        lossStreak: maxLossStreak,
        trades,
        badges,
    };
}

