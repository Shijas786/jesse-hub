'use client';

import { CartoonButton } from './CartoonButton';

interface ErrorFallbackProps {
    error?: Error | null;
    resetError?: () => void;
    title?: string;
}

export function ErrorFallback({ error, resetError, title }: ErrorFallbackProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] px-6 py-12">
            <div className="relative">
                <div className="text-8xl mb-6 animate-bounce">
                    😵
                </div>
                <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow">
                    💫
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
                {title || 'Oops! Something went wrong'}
            </h2>

            {error && (
                <p className="text-gray-400 text-center max-w-md mb-6">
                    {error.message || 'Failed to load data'}
                </p>
            )}

            <p className="text-sm text-gray-500 mb-8 text-center max-w-sm">
                Check your internet connection or try again in a few moments.
                If the problem persists, the backend might be down.
            </p>

            {resetError && (
                <CartoonButton
                    onClick={resetError}
                    variant="primary"
                >
                    Try Again
                </CartoonButton>
            )}
        </div>
    );
}

