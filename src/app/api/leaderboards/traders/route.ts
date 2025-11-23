import { NextResponse } from 'next/server';
import { fetchTraderAnalytics } from '@/lib/server/traders';

export async function GET() {
    try {
        const analytics = await fetchTraderAnalytics();
        const scalpers = [...analytics]
            .sort((a, b) => b.scalperScore - a.scalperScore)
            .slice(0, 20);
        const rekt = [...analytics]
            .filter((entry) => entry.realizedProfit < 0)
            .sort((a, b) => a.realizedProfit - b.realizedProfit)
            .slice(0, 20);
        const whales = [...analytics]
            .sort((a, b) => b.totalBuys - a.totalBuys)
            .slice(0, 20);

        return NextResponse.json({
            profit: analytics.slice(0, 20),
            scalpers,
            rekt,
            whales,
        });
    } catch (error) {
        console.error('trader leaderboard error', error);
        return NextResponse.json({ error: 'Failed to load trader leaderboards' }, { status: 500 });
    }
}

