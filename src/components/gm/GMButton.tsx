'use client';

import { useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import JesseGMAbi from '@/lib/abis/JesseGM.json';
import { useGMStreak } from '@/hooks/useGMStreak';
import { CartoonButton } from '@/components/CartoonButton';
import { motion } from 'framer-motion';

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
        <div className="w-full mt-8">
            <CartoonButton
                onClick={handleClick}
                disabled={isPending || isConfirming}
                className="w-full py-6 text-xl"
                variant={isSuccess ? 'success' : 'primary'}
            >
                {isPending || isConfirming ? (
                    <motion.span 
                        animate={{ opacity: [0.5, 1, 0.5] }} 
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        Casting... ⏳
                    </motion.span>
                ) : isSuccess ? (
                    <span>GM Sent! ✅</span>
                ) : (
                    <span>Cast GM! 📣</span>
                )}
            </CartoonButton>
            
            {writeError && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-2 text-doodle-pink font-bold text-sm"
                >
                    Oops! Transaction failed 😵
                </motion.div>
            )}
        </div>
    );
}

