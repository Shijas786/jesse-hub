import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { BottomNav } from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Jesse Hub - Holder Analytics & GM Streak',
    description: 'The ultimate hub for Jesse token holders with analytics, GM streaks, leaderboards, and missions',
    manifest: '/manifest.json',
    openGraph: {
        title: 'Jesse Hub',
        description: 'Holder analytics, GM streaks, and gamified missions for Jesse token',
        images: ['/og-image.svg'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-dark-bg text-white antialiased`}>
                <Providers>
                    <main className="min-h-screen pb-20">
                        {children}
                    </main>
                    <BottomNav />
                </Providers>
            </body>
        </html>
    );
}
