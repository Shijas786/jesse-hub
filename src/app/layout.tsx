import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { BottomNav } from '@/components/BottomNav';
import { FloatingStickers } from '@/components/FloatingStickers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Jesse Hub',
    description: 'The ultimate companion app for Jesse token holders',
    manifest: '/manifest.json',
    metadataBase: new URL('https://jesse-hub.vercel.app'),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <FloatingStickers />
                    <main className="pb-24 px-4 pt-6 max-w-md mx-auto min-h-screen relative z-10">
                        {children}
                    </main>
                    <BottomNav />
                </Providers>
            </body>
        </html>
    );
}
