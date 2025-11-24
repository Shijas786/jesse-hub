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

        const winners = analytics
            .filter((entry) => entry.realizedProfit > 0)
            .slice(0, 20);

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
    } catch (err) {
        const isDev = process.env.NODE_ENV === 'development';
        const message = err instanceof Error ? err.message : 'Unknown error';

        console.error('GET /api/traders error:', {
            message,
            error: err instanceof Error ? err.toString() : String(err),
            stack: isDev && err instanceof Error ? err.stack : undefined,
        });

        return NextResponse.json(
            {
                error: 'Failed to load trader data',
                message: isDev ? message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
