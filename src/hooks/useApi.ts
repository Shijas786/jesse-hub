'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useApi<T>(
    key: (string | number | null | undefined)[],
    url: string,
    options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>
) {
    return useQuery<T, Error>({
        queryKey: key,
        queryFn: async () => {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            return (await response.json()) as T;
        },
        staleTime: 60 * 1000,
        ...options,
    });
}

