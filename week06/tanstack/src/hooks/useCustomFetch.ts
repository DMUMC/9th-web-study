import { useQuery } from '@tanstack/react-query';

// React Query 기반 서버 상태 관리를 래핑한 커스텀 훅

const STALE_TIME = 5 * 60 * 1_000;
const GC_TIME = 10 * 60 * 1_000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1_000;
const MAX_RETRY_DELAY = 30_000;

export const useCustomFetch = <T>(url: string) =>
    useQuery<T>({
        queryKey: [url],
        queryFn: async ({ signal }) => {
            const response = await fetch(url, { signal });
            if (!response.ok) {
                throw new Error(`HTTP Status: ${response.status}`);
            }
            return response.json() as Promise<T>;
        },
        retry: MAX_RETRIES,
        retryDelay: (attemptIndex) =>
            Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attemptIndex), MAX_RETRY_DELAY),
        staleTime: STALE_TIME,
        gcTime: GC_TIME,
    });
