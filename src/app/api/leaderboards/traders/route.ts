import { NextResponse } from 'next/server';
import { fetchTraderAnalytics } from '@/lib/server/traders';

export const dynamic = 'force-dynamic';

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
        const isDev = process.env.NODE_ENV === 'development';
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        
        console.error('GET /api/leaderboards/traders error:', {
            message,
            stack: isDev ? stack : undefined,
            error: error instanceof Error ? error.toString() : String(error),
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to load trader leaderboards',
                message: isDev ? message : 'Internal server error',
                ...(isDev && stack ? { stack } : {}),
            },
            { status: 500 }
        );
    }
}

