'use client';

import { AlertCircle } from 'lucide-react';

interface ApiErrorFallbackProps {
    error: Error | string;
    retry?: () => void;
    className?: string;
}

export function ApiErrorFallback({ error, retry, className = '' }: ApiErrorFallbackProps) {
    const message = typeof error === 'string' ? error : error.message;

    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 rounded-2xl bg-red-500/10 p-6 text-center ${className}`}
        >
            <AlertCircle className="h-12 w-12 text-red-400" />
            <div>
                <h3 className="text-lg font-semibold text-red-400">Failed to load data</h3>
                <p className="mt-2 text-sm text-gray-400">{message}</p>
            </div>
            {retry && (
                <button
                    onClick={retry}
                    className="rounded-full bg-base-blue px-6 py-2 text-sm font-semibold text-black transition hover:bg-base-blue/80"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

