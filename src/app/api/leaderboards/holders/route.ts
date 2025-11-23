import { NextResponse } from 'next/server';
import { fetchHolderSnapshot } from '@/lib/server/holders';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { holders } = await fetchHolderSnapshot();
        const whales = holders.filter((holder) => holder.whale).slice(0, 20);
        const diamonds = holders.filter((holder) => holder.diamond).slice(0, 20);
        const diamondHands = [...holders]
            .sort((a, b) => (b.diamondScore ?? 0) - (a.diamondScore ?? 0))
            .slice(0, 20);
        const paperHands = holders.filter((holder) => holder.paper).slice(0, 20);

        return NextResponse.json({
            top: holders.slice(0, 20),
            whales,
            diamonds,
            diamondHands,
            paperHands,
        });
    } catch (error) {
        console.error('holder leaderboard error', error);
        return NextResponse.json({ error: 'Failed to load holder leaderboards' }, { status: 500 });
    }
}

