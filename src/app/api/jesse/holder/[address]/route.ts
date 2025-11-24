import { NextResponse } from 'next/server';
import { getJesseTransfersForAddress, getTokenBalanceForAddress } from '@/lib/goldrush';
import { getJesseTokenAddress } from '@/lib/config';

export const dynamic = 'force-dynamic';

/**
 * Get holder analytics for a specific address
 * Computes: holding duration, first buy, last sell, holder score, etc.
 */
export async function GET(
    req: Request,
    { params }: { params: { address: string } }
) {
    try {
        const address = params.address.toLowerCase() as `0x${string}`;
        const jesseToken = getJesseTokenAddress();

        // Get current balance
        const balanceData = await getTokenBalanceForAddress(address, jesseToken);
        
        // Get all transfers
        const transfersData = await getJesseTransfersForAddress(address, jesseToken);
        const transfers = transfersData.items || [];

        // Process transfers to classify IN/OUT
        const processedTransfers = transfers
            .flatMap((tx: any) => 
                (tx.transfers || []).map((transfer: any) => ({
                    ...transfer,
                    block_signed_at: tx.block_signed_at,
                    tx_hash: tx.tx_hash,
                    successful: tx.successful,
                }))
            )
            .filter((t: any) => 
                t.contract_address?.toLowerCase() === jesseToken.toLowerCase()
            )
            .sort((a: any, b: any) => 
                new Date(a.block_signed_at).getTime() - new Date(b.block_signed_at).getTime()
            );

        const ins = processedTransfers.filter((t: any) => 
            t.transfer_type === 'transfer-in' || t.to_address?.toLowerCase() === address.toLowerCase()
        );
        const outs = processedTransfers.filter((t: any) => 
            t.transfer_type === 'transfer-out' || t.from_address?.toLowerCase() === address.toLowerCase()
        );

        const firstIn = ins[0];
        const lastOut = outs[outs.length - 1] || null;

        const now = Math.floor(Date.now() / 1000);
        const firstBuyTime = firstIn 
            ? Math.floor(new Date(firstIn.block_signed_at).getTime() / 1000)
            : null;
        const lastSellTime = lastOut
            ? Math.floor(new Date(lastOut.block_signed_at).getTime() / 1000)
            : null;

        const daysSinceFirstBuy = firstBuyTime 
            ? (now - firstBuyTime) / 86400 
            : 0;
        const daysSinceLastSell = lastSellTime 
            ? (now - lastSellTime) / 86400 
            : daysSinceFirstBuy;
        const hasEverSold = lastOut !== null;

        // Get current balance
        const decimals = balanceData?.contract_decimals || 18;
        const currentBalanceRaw = balanceData?.balance ? BigInt(balanceData.balance) : BigInt(0);
        const currentBalance = Number(currentBalanceRaw) / 10 ** decimals;

        // Compute holder score
        const holderScore = 
            daysSinceFirstBuy * 2 +
            Math.log10(currentBalance + 1) * 10 -
            (hasEverSold ? 20 : 0);

        // Determine holder type
        let holderType = 'New Holder';
        if (holderScore > 100 && !hasEverSold) {
            holderType = 'True OG';
        } else if (holderScore > 50 && daysSinceLastSell > 30) {
            holderType = 'Strong Holder';
        } else if (ins.length > 5 && outs.length > 3) {
            holderType = 'Farmer';
        } else if (hasEverSold && currentBalance === 0) {
            holderType = 'Paper Hands';
        }

        return NextResponse.json({
            address,
            currentBalance,
            currentBalanceRaw: balanceData?.balance || '0',
            holderScore: Math.round(holderScore * 100) / 100,
            holderType,
            metrics: {
                daysSinceFirstBuy: Math.round(daysSinceFirstBuy * 100) / 100,
                daysSinceLastSell: Math.round(daysSinceLastSell * 100) / 100,
                hasEverSold,
                totalBuys: ins.length,
                totalSells: outs.length,
                firstBuyTime: firstBuyTime ? new Date(firstBuyTime * 1000).toISOString() : null,
                lastSellTime: lastSellTime ? new Date(lastSellTime * 1000).toISOString() : null,
            },
            transfers: {
                all: processedTransfers,
                buys: ins,
                sells: outs,
            },
        });
    } catch (error: any) {
        console.error('Error fetching holder analytics:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch holder analytics' },
            { status: 500 }
        );
    }
}

