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
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || errorData.details || `Request failed: ${response.status}`;
                console.error(`API Error [${url}]:`, errorMessage);
                throw new Error(errorMessage);
            }
            const data = await response.json();
            if (data.error) {
                console.error(`API Error [${url}]:`, data.error, data.details);
                throw new Error(data.error);
            }
            return data as T;
        },
        staleTime: 60 * 1000,
        ...options,
    });
}

