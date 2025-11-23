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
        const isDev = process.env.NODE_ENV === 'development';
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        
        console.error('GET /api/leaderboards/holders error:', {
            message,
            stack: isDev ? stack : undefined,
            error: error instanceof Error ? error.toString() : String(error),
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to load holder leaderboards',
                message: isDev ? message : 'Internal server error',
                ...(isDev && stack ? { stack } : {}),
            },
            { status: 500 }
        );
    }
}

