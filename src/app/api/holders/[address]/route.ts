import { NextResponse } from 'next/server';
import {
    getAddressTokenBalance,
    getGmEvents,
    getHolderTransfers,
    getTokenHolders,
} from '@/lib/covalent';
import { requireEnv } from '@/lib/config';
import { getFarcasterProfiles } from '@/lib/neynar';
import { deriveBadges } from '@/utils/badges';
import { buildBehaviorMap, buildActivitySeries } from '@/utils/holders';
import { buildGmStreakMap } from '@/utils/gm';
import { HolderDetail } from '@/types';

const normalize = (address: string) => address.toLowerCase() as `0x${string}`;

export async function GET(
    _request: Request,
    { params }: { params: { address: string } }
) {
    try {
        const address = normalize(params.address);
        const tokenAddress = requireEnv('tokenAddress');

        const [transfers, holders, gmEvents, balanceInfo] = await Promise.all([
            getHolderTransfers(address, 300),
            getTokenHolders(300),
            getGmEvents(400),
            getAddressTokenBalance(address),
        ]);

        const behaviorMap = buildBehaviorMap(transfers, tokenAddress);
        const behavior = behaviorMap.get(address);
        const gmMap = buildGmStreakMap(gmEvents);
        const gm = gmMap.get(address);
        const farcaster = await getFarcasterProfiles([address]);

        const decimals = holders[0]?.contract_decimals ?? 18;
        const totalSupply = holders[0] ? Number(BigInt(holders[0].total_supply)) / 10 ** decimals : 0;
        const holderEntry = holders.find((holder) => holder.address.toLowerCase() === address);
        const balance =
            balanceInfo?.balance ??
            (holderEntry ? Number(BigInt(holderEntry.balance)) / 10 ** holderEntry.contract_decimals : 0);
        const balanceQuote = balanceInfo?.balanceQuote ?? holderEntry?.balance_quote ?? 0;
        const rank = holderEntry ? holders.indexOf(holderEntry) + 1 : null;

        const badges = deriveBadges({
            daysHeld: behavior?.daysHeld,
            rank: rank ?? undefined,
            hasSold: behavior?.hasSold === true ? true : behavior ? false : undefined,
            gmStreak: gm?.streak,
            tradeCount: behavior?.tradeCount,
            realizedProfit: behavior?.realizedProfit,
        });

        const detail: HolderDetail = {
            address,
            balance,
            balanceQuote,
            percentage: totalSupply ? (balance / totalSupply) * 100 : 0,
            rank: rank ?? holders.length + 1,
            whale: rank ? rank <= Math.max(1, Math.floor(holders.length * 0.01)) : false,
            diamond: behavior ? behavior.totalSells === 0 : false,
            paper: behavior?.paperHands ?? false,
            gmStreak: gm?.streak ?? 0,
            badges,
            farcaster: farcaster.get(address) ?? null,
            firstBuy: behavior?.firstBuy,
            lastSell: behavior?.lastSell,
            totalBuys: behavior?.totalBuys,
            totalSells: behavior?.totalSells,
            daysHeld: behavior?.daysHeld,
            diamondScore: behavior?.diamondScore,
            scalperScore: behavior?.scalperScore,
            activity: buildActivitySeries(address, transfers, tokenAddress, decimals),
        };

        return NextResponse.json({
            holder: detail,
            realizedProfit: behavior?.realizedProfit ?? 0,
            buyValue: behavior?.buyValue ?? 0,
            sellValue: behavior?.sellValue ?? 0,
        });
    } catch (error) {
        console.error('holder detail error', error);
        return NextResponse.json({ error: 'Failed to load holder profile' }, { status: 500 });
    }
}

