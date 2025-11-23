import { getTokenHolders, getTokenTransfers, getGmEvents } from '@/lib/covalent';
import { getFarcasterProfiles } from '@/lib/neynar';
import { requireEnv } from '@/lib/config';
import { buildBehaviorMap } from '@/utils/holders';
import { buildGmStreakMap } from '@/utils/gm';
import { deriveBadges } from '@/utils/badges';
import { HolderSummary } from '@/types';

const toUnits = (value: string, decimals: number) => {
    try {
        return Number(BigInt(value)) / 10 ** decimals;
    } catch {
        return 0;
    }
};

export interface HolderSnapshot {
    holders: HolderSummary[];
    stats: {
        totalHolders: number;
        totalSupply: number;
        topHolderPercentage: number;
        circulatingSupply: number;
        treasuryBalance: number;
    };
}

export async function fetchHolderSnapshot(limit = 250): Promise<HolderSnapshot> {
    const [holdersRaw, transfers, gmEvents] = await Promise.all([
        getTokenHolders(limit),
        getTokenTransfers(800),
        getGmEvents(400),
    ]);

    const tokenAddress = requireEnv('tokenAddress');
    const decimals = holdersRaw[0]?.contract_decimals ?? 18;
    const totalSupply = holdersRaw[0] ? toUnits(holdersRaw[0].total_supply, decimals) : 0;
    const behaviorMap = buildBehaviorMap(transfers, tokenAddress);
    const gmMap = buildGmStreakMap(gmEvents);
    const farcasterMap = await getFarcasterProfiles(
        holdersRaw.map((holder) => holder.address.toLowerCase() as `0x${string}`)
    );
    const whaleCutoff = Math.max(1, Math.floor(holdersRaw.length * 0.01));

    const holders: HolderSummary[] = holdersRaw.map((item, index) => {
        const normalized = item.address.toLowerCase() as `0x${string}`;
        const balance = toUnits(item.balance, item.contract_decimals);
        const behavior = behaviorMap.get(normalized);
        const gm = gmMap.get(normalized);
        const badges = deriveBadges({
            daysHeld: behavior?.daysHeld,
            rank: index + 1,
            hasSold: behavior?.hasSold === true ? true : behavior ? false : undefined,
            gmStreak: gm?.streak,
            tradeCount: behavior?.tradeCount,
            realizedProfit: behavior?.realizedProfit,
        });

        return {
            address: normalized,
            balance,
            balanceQuote: item.balance_quote ?? 0,
            percentage: totalSupply ? (balance / totalSupply) * 100 : 0,
            rank: index + 1,
            whale: index + 1 <= whaleCutoff,
            diamond: behavior ? behavior.totalSells === 0 : false,
            paper: behavior?.paperHands ?? false,
            gmStreak: gm?.streak ?? 0,
            badges,
            farcaster: farcasterMap.get(normalized) ?? null,
            firstBuy: behavior?.firstBuy,
            lastSell: behavior?.lastSell,
            totalBuys: behavior?.totalBuys,
            totalSells: behavior?.totalSells,
            daysHeld: behavior?.daysHeld,
            diamondScore: behavior?.diamondScore,
            scalperScore: behavior?.scalperScore,
        };
    });

    const stats = {
        totalHolders: holdersRaw.length,
        totalSupply,
        topHolderPercentage: totalSupply ? ((holders[0]?.balance ?? 0) / totalSupply) * 100 : 0,
        circulatingSupply: Math.max(0, totalSupply - (holders[0]?.balance ?? 0)),
        treasuryBalance: holders[0]?.balance ?? 0,
    };

    return { holders, stats };
}

