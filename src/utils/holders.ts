import { TransferItem } from '@/lib/goldrush';
import { daysBetween } from './format';

export interface HolderBehavior {
    totalBuys: number;
    totalSells: number;
    buyValue: number;
    sellValue: number;
    realizedProfit: number;
    firstBuy?: string;
    lastSell?: string;
    tradeCount: number;
    scalperScore: number;
    hasSold: boolean;
    paperHands: boolean;
    daysHeld?: number;
    diamondScore: number;
}

interface BehaviorRecord extends HolderBehavior {
    lastBuyAt?: string;
}

const HOURS_IN_MS = 1000 * 60 * 60;

const normalize = (address: string) => address.toLowerCase() as `0x${string}`;

const toUnits = (value: string, decimals: number) => {
    try {
        const numeric = Number(BigInt(value));
        return numeric / 10 ** decimals;
    } catch {
        return 0;
    }
};

function ensureRecord(map: Map<`0x${string}`, BehaviorRecord>, address: `0x${string}`) {
    if (!map.has(address)) {
        map.set(address, {
            totalBuys: 0,
            totalSells: 0,
            buyValue: 0,
            sellValue: 0,
            realizedProfit: 0,
            tradeCount: 0,
            scalperScore: 0,
            hasSold: false,
            paperHands: false,
            diamondScore: 0,
        });
    }
    return map.get(address)!;
}

export function buildBehaviorMap(transfers: TransferItem[], tokenAddress: `0x${string}`) {
    const tokenLower = tokenAddress.toLowerCase();
    const map = new Map<`0x${string}`, BehaviorRecord>();
    const ordered = [...transfers].sort(
        (a, b) => new Date(a.block_signed_at).getTime() - new Date(b.block_signed_at).getTime()
    );

    ordered.forEach((item) => {
        const timestamp = item.block_signed_at;
        item.transfers
            ?.filter((transfer) => transfer.contract_address.toLowerCase() === tokenLower)
            .forEach((transfer) => {
                const amount = Math.abs(toUnits(transfer.delta, transfer.contract_decimals));
                const value = Math.abs(transfer.delta_quote ?? item.value_quote ?? 0);
                if (!amount) {
                    return;
                }

                const buyer = normalize(transfer.to_address);
                const seller = normalize(transfer.from_address);

                const buyerRecord = ensureRecord(map, buyer);
                buyerRecord.totalBuys += amount;
                buyerRecord.buyValue += value;
                buyerRecord.tradeCount += 1;
                buyerRecord.firstBuy = buyerRecord.firstBuy
                    ? new Date(timestamp) < new Date(buyerRecord.firstBuy)
                        ? timestamp
                        : buyerRecord.firstBuy
                    : timestamp;
                buyerRecord.lastBuyAt = timestamp;

                const sellerRecord = ensureRecord(map, seller);
                sellerRecord.totalSells += amount;
                sellerRecord.sellValue += value;
                sellerRecord.tradeCount += 1;
                sellerRecord.lastSell = timestamp;
                sellerRecord.hasSold = true;

                if (sellerRecord.lastBuyAt) {
                    const diffHours =
                        (new Date(timestamp).getTime() - new Date(sellerRecord.lastBuyAt).getTime()) /
                        HOURS_IN_MS;
                    if (diffHours >= 0 && diffHours <= 6) {
                        sellerRecord.scalperScore += 1;
                    }
                    sellerRecord.lastBuyAt = undefined;
                }
            });
    });

    map.forEach((record) => {
        if (record.firstBuy) {
            record.daysHeld = daysBetween(record.firstBuy);
        }
        record.paperHands = record.totalSells > 0 && record.totalSells >= record.totalBuys * 0.6;
        record.realizedProfit = record.sellValue - record.buyValue;
        record.diamondScore =
            (record.daysHeld ?? 0) * 2 + Math.max(0, record.totalBuys - record.totalSells) * 5 - record.totalSells;
    });

    return map;
}

export function buildActivitySeries(
    address: `0x${string}`,
    transfers: TransferItem[],
    tokenAddress: `0x${string}`,
    decimals: number
) {
    const tokenLower = tokenAddress.toLowerCase();
    const normalized = normalize(address);
    const buckets = new Map<string, number>();

    transfers.forEach((item) => {
        const dateKey = item.block_signed_at.slice(0, 10);
        let delta = 0;

        item.transfers
            ?.filter((transfer) => transfer.contract_address.toLowerCase() === tokenLower)
            .forEach((transfer) => {
                const tokenDecimals = transfer.contract_decimals ?? decimals;
                const amount = Math.abs(toUnits(transfer.delta, tokenDecimals));
                if (!amount) return;

                if (transfer.to_address.toLowerCase() === normalized) {
                    delta += amount;
                } else if (transfer.from_address.toLowerCase() === normalized) {
                    delta -= amount;
                }
            });

        if (!delta) return;
        buckets.set(dateKey, (buckets.get(dateKey) ?? 0) + delta);
    });

    return Array.from(buckets.entries())
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([timestamp, value]) => ({ timestamp, value }));
}

