import { NextResponse } from 'next/server';
import { fetchHolderSnapshot } from '@/lib/server/holders';

export async function GET() {
    try {
        const { holders, stats } = await fetchHolderSnapshot();
        return NextResponse.json({ holders, stats });
    } catch (error) {
        console.error('holders api error', error);
        return NextResponse.json({ error: 'Failed to load holders' }, { status: 500 });
    }
}
