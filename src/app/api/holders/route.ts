import { NextResponse } from 'next/server';
import { fetchHolderSnapshot } from '@/lib/server/holders';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { holders, stats } = await fetchHolderSnapshot();
        return NextResponse.json({ holders, stats });
    } catch (error) {
        const isDev = process.env.NODE_ENV === 'development';
        const message = error instanceof Error ? error.message : 'Unknown error';
        const stack = error instanceof Error ? error.stack : undefined;
        
        console.error('GET /api/holders error:', {
            message,
            stack: isDev ? stack : undefined,
            error: error instanceof Error ? error.toString() : String(error),
        });
        
        return NextResponse.json(
            { 
                error: 'Failed to load holders',
                message: isDev ? message : 'Internal server error',
                ...(isDev && stack ? { stack } : {}),
            },
            { status: 500 }
        );
    }
}
