import { getTokenTransfers, getTokenHolders, TransferItem } from '@/lib/covalent';
import { getJesseTokenAddress } from '@/lib/config';
import { computeTraderAnalytics } from '@/utils/traders';
import { getFarcasterProfiles } from '@/lib/neynar';
import { TraderAnalytics } from '@/types';

const normalize = (address: string) => address.toLowerCase() as `0x${string}`;

function cloneItemWithTransfers(item: TransferItem, transfers: TransferItem['transfers']) {
    return {
        ...item,
        transfers,
    };
}

function groupTransfersByAddress(transfers: TransferItem[], tokenAddress: `0x${string}`) {
    const tokenLower = tokenAddress.toLowerCase();
    const map = new Map<`0x${string}`, TransferItem[]>();

    transfers.forEach((item) => {
        const relevant = item.transfers?.filter(
            (transfer) => transfer.contract_address.toLowerCase() === tokenLower
        );
        if (!relevant?.length) return;

        const participants = new Set<`0x${string}`>();
        relevant.forEach((transfer) => {
            participants.add(normalize(transfer.to_address));
            participants.add(normalize(transfer.from_address));
        });

        participants.forEach((participant) => {
            const filtered = relevant.filter(
                (transfer) =>
                    transfer.to_address.toLowerCase() === participant ||
                    transfer.from_address.toLowerCase() === participant
            );
            if (!filtered.length) return;
            const existing = map.get(participant) ?? [];
            map.set(participant, [...existing, cloneItemWithTransfers(item, filtered)]);
        });
    });

    return map;
}

export async function fetchTraderAnalytics(limit = 60) {
    const tokenAddress = getJesseTokenAddress();
    const [transfers, holders] = await Promise.all([
        getTokenTransfers(1200),
        getTokenHolders(limit),
    ]);

    const decimals = holders[0]?.contract_decimals ?? 18;
    const grouped = groupTransfersByAddress(transfers, tokenAddress);
    const candidates = Array.from(grouped.keys());

    const analytics: TraderAnalytics[] = [];

    candidates.forEach((address) => {
        const items = grouped.get(address);
        if (!items?.length) return;
        const result = computeTraderAnalytics(address, items, tokenAddress, decimals);
        if (result.trades.length) {
            analytics.push(result);
        }
    });

    const farcasterProfiles = await getFarcasterProfiles(candidates);
    analytics.forEach((entry) => {
        entry.farcaster = farcasterProfiles.get(entry.address.toLowerCase() as `0x${string}`) ?? null;
    });

    analytics.sort((a, b) => b.realizedProfit - a.realizedProfit);
    return analytics;
}

