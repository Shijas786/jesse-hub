import { getTokenHoldersLegacy, getHolderTransfers, getGmEvents } from '@/lib/goldrush';
import { getFarcasterProfiles } from '@/lib/neynar';
import { getJesseTokenAddress } from '@/lib/config';
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

const GM_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS ||
    process.env.JESSE_GM_CONTRACT_ADDRESS;

export async function fetchHolderSnapshot(limit = 250): Promise<HolderSnapshot> {
    try {
        const tokenAddress = getJesseTokenAddress();
        
        if (!GM_CONTRACT_ADDRESS) {
            throw new Error('Missing NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS environment variable');
        }

        // Get top holders first
        const holdersRaw = await getTokenHoldersLegacy(limit);
        
        // Get transfers for top 30 holders (to avoid too many API calls)
        const topHolders = holdersRaw.slice(0, 30);
        const transferPromises = topHolders.map((holder) =>
            getHolderTransfers(holder.address, tokenAddress, 30)
        );
        const allTransfers = await Promise.all(transferPromises);
        const transfers = allTransfers.flat();
        
        // Get GM events
        const gmEvents = await getGmEvents(GM_CONTRACT_ADDRESS, 400);

    const decimals = holdersRaw[0]?.contract_decimals ?? 18;
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
    } catch (error) {
        console.error('fetchHolderSnapshot error:', error);
        throw error;
    }
}

