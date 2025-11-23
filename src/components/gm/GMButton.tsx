'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import JesseGMAbi from '@/lib/abis/JesseGM.json';
import { useGMStreak } from '@/hooks/useGMStreak';

const gmAddress = process.env.NEXT_PUBLIC_JESSE_GM_CONTRACT_ADDRESS as `0x${string}` | undefined;

export function GMButton() {
    const { address, isConnected } = useAccount();
    const { open } = useAppKit();
    const { refetch } = useGMStreak(address);

    const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            refetch();
        }
    }, [isSuccess, refetch]);

    const handleClick = async () => {
        if (!isConnected) {
            open();
            return;
        }
        if (!gmAddress) {
            console.error('Missing GM contract address');
            return;
        }
        try {
            await writeContract({
                address: gmAddress,
                abi: JesseGMAbi,
                functionName: 'gm',
            });
        } catch (error) {
            console.error('GM transaction failed', error);
        }
    };

    return (
        <motion.button
            className="mt-8 w-full py-4 rounded-full bg-gradient-neon text-dark-bg font-semibold text-lg neon-glow flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleClick}
            disabled={isPending || isConfirming}
        >
            {isPending || isConfirming ? 'Casting GM...' : 'Cast Onchain GM'}
            {isSuccess && <span>✅</span>}
            {writeError && <span className="text-xs text-red-400">Error</span>}
        </motion.button>
    );
}

