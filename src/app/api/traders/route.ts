import { NextResponse } from 'next/server';
import { fetchTraderAnalytics } from '@/lib/server/traders';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const analytics = await fetchTraderAnalytics();
        const profit = analytics.slice(0, 20);
        const scalpers = [...analytics]
            .sort((a, b) => b.scalperScore - a.scalperScore)
            .slice(0, 20);
        const winners = analytics.filter((entry) => entry.realizedProfit > 0).slice(0, 20);
        const losers = analytics
            .filter((entry) => entry.realizedProfit < 0)
            .sort((a, b) => a.realizedProfit - b.realizedProfit)
            .slice(0, 20);

        return NextResponse.json({
            profit,
            scalpers,
            winners,
            losers,
        });
    } catch (error) {
        console.error('traders api error', error);
        return NextResponse.json({ error: 'Failed to load trader data' }, { status: 500 });
    }
}

