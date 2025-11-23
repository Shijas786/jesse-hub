'use client';

import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { base } from 'wagmi/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const metadata = {
    name: 'Jesse Hub',
    description: 'Holder analytics and GM streak system for Jesse token',
    url: 'https://jesse-hub.vercel.app',
    icons: ['https://jesse-hub.vercel.app/icon.png'],
};

const wagmiAdapter = new WagmiAdapter({
    networks: [base],
    projectId,
});

createAppKit({
    adapters: [wagmiAdapter],
    networks: [base],
    metadata,
    projectId,
    features: {
        analytics: true,
    },
});

export function Providers({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
