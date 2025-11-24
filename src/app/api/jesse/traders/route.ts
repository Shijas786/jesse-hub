import { NextResponse } from 'next/server';
import { getTokenHolders, getJesseTransfersForAddress, getTokenPrices } from '@/lib/goldrush';
import { getJesseTokenAddress } from '@/lib/config';

export const dynamic = 'force-dynamic';

/**
 * Get trader analytics: PnL, scalpers, winners, losers
 * Precomputes PnL for top N holders
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const sortBy = searchParams.get('sortBy') || 'pnl'; // 'pnl', 'trades', 'scalper'

        const jesseToken = getJesseTokenAddress();

        // Get top holders
        const holdersData = await getTokenHolders(jesseToken, 0, limit);
        const holders = holdersData.items || [];

        // Get price history for PnL calculation
        const pricePoints = await getTokenPrices(jesseToken);
        const prices = pricePoints.sort((a, b) => a.timestamp - b.timestamp);

        // Helper to get price at a given timestamp
        const getPriceAtTime = (timestamp: string): number => {
            const tradeTime = new Date(timestamp).getTime();
            let closest = prices[0]?.price || 0;
            let minDiff = Infinity;
            
            for (const price of prices) {
                const diff = Math.abs(tradeTime - price.timestamp);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = price.price || 0;
                }
            }
            return closest;
        };

        // Process each holder's transfers to compute PnL
        const traderAnalytics = await Promise.all(
            holders.slice(0, limit).map(async (holder: any) => {
                try {
                    const address = holder.address;
                    const transfersData = await getJesseTransfersForAddress(address, jesseToken);
                    const transfers = transfersData.items || [];

                    // Process transfers
                    const processedTransfers = transfers
                        .flatMap((tx: any) =>
                            (tx.transfers || []).map((transfer: any) => ({
                                ...transfer,
                                block_signed_at: tx.block_signed_at,
                                tx_hash: tx.tx_hash,
                                price: getPriceAtTime(tx.block_signed_at),
                            }))
                        )
                        .filter((t: any) =>
                            t.contract_address?.toLowerCase() === jesseToken.toLowerCase()
                        )
                        .sort((a: any, b: any) =>
                            new Date(a.block_signed_at).getTime() - new Date(b.block_signed_at).getTime()
                        );

                    const buys = processedTransfers.filter((t: any) =>
                        t.transfer_type === 'transfer-in' || t.to_address?.toLowerCase() === address.toLowerCase()
                    );
                    const sells = processedTransfers.filter((t: any) =>
                        t.transfer_type === 'transfer-out' || t.from_address?.toLowerCase() === address.toLowerCase()
                    );

                    // Compute PnL
                    let totalBuys = 0;
                    let totalSells = 0;

                    buys.forEach((buy: any) => {
                        const amount = Number(BigInt(buy.delta || '0')) / 10 ** (buy.contract_decimals || 18);
                        const price = buy.price || 0;
                        totalBuys += amount * price;
                    });

                    sells.forEach((sell: any) => {
                        const amount = Math.abs(Number(BigInt(sell.delta || '0')) / 10 ** (sell.contract_decimals || 18));
                        const price = sell.price || 0;
                        totalSells += amount * price;
                    });

                    const realizedPnl = totalSells - totalBuys;
                    const numTrades = buys.length + sells.length;
                    
                    // Get holding duration
                    const firstBuy = buys[0];
                    const lastSell = sells[sells.length - 1];
                    const firstBuyTime = firstBuy ? new Date(firstBuy.block_signed_at).getTime() : Date.now();
                    const lastSellTime = lastSell ? new Date(lastSell.block_signed_at).getTime() : Date.now();
                    const daysActive = (Date.now() - firstBuyTime) / (1000 * 60 * 60 * 24);
                    
                    const scalperScore = daysActive > 0 ? numTrades / daysActive : 0;
                    const winRate = numTrades > 0 ? (realizedPnl > 0 ? 1 : 0) : 0; // Simplified

                    // Current balance
                    const decimals = holder.contract_decimals || 18;
                    const currentBalance = Number(BigInt(holder.balance || '0')) / 10 ** decimals;
                    const currentPrice = prices[prices.length - 1]?.price || 0;
                    const unrealizedPnl = currentBalance * currentPrice;

                    return {
                        address: holder.address,
                        balance: currentBalance,
                        realizedPnl: Math.round(realizedPnl * 100) / 100,
                        unrealizedPnl: Math.round(unrealizedPnl * 100) / 100,
                        totalPnl: Math.round((realizedPnl + unrealizedPnl) * 100) / 100,
                        numTrades,
                        numBuys: buys.length,
                        numSells: sells.length,
                        scalperScore: Math.round(scalperScore * 100) / 100,
                        winRate,
                        daysActive: Math.round(daysActive * 100) / 100,
                        firstBuyTime: firstBuy ? firstBuy.block_signed_at : null,
                        lastSellTime: lastSell ? lastSell.block_signed_at : null,
                    };
                } catch (error) {
                    console.error(`Error processing holder ${holder.address}:`, error);
                    return null;
                }
            })
        );

        // Filter out nulls and sort
        const validAnalytics = traderAnalytics.filter((a): a is NonNullable<typeof a> => a !== null);

        // Sort based on sortBy parameter
        let sorted = [...validAnalytics];
        if (sortBy === 'pnl') {
            sorted.sort((a, b) => b.totalPnl - a.totalPnl);
        } else if (sortBy === 'trades') {
            sorted.sort((a, b) => b.numTrades - a.numTrades);
        } else if (sortBy === 'scalper') {
            sorted.sort((a, b) => b.scalperScore - a.scalperScore);
        }

        // Separate winners and losers
        const winners = sorted.filter((t) => t.totalPnl > 0);
        const losers = sorted.filter((t) => t.totalPnl < 0).reverse(); // Most rekt first
        const scalpers = sorted.filter((t) => t.scalperScore > 1).sort((a, b) => b.scalperScore - a.scalperScore);

        return NextResponse.json({
            traders: sorted,
            winners: winners.slice(0, 20),
            losers: losers.slice(0, 20),
            scalpers: scalpers.slice(0, 20),
            stats: {
                total: sorted.length,
                totalWinners: winners.length,
                totalLosers: losers.length,
                totalScalpers: scalpers.length,
            },
        });
    } catch (error: any) {
        console.error('Error fetching trader analytics:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch trader analytics' },
            { status: 500 }
        );
    }
}

