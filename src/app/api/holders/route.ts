import { NextResponse } from 'next/server';
import { fetchHolderSnapshot } from '@/lib/server/holders';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { holders, stats } = await fetchHolderSnapshot();
        return NextResponse.json({ holders, stats });
    } catch (error) {
        console.error('holders api error', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { 
                error: 'Failed to load holders',
                details: process.env.NODE_ENV === 'development' ? message : undefined
            },
            { status: 500 }
        );
    }
}
