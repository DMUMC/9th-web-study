import { useEffect, useMemo, useRef, useState } from 'react';

const STALE_TIME = 10 * 1000;

const MAX_RETRIES = 3;

const INITIAL_RETRY_DELAY = 1000;

interface CacheEntry<T> {
    data: T;
    lastFetched: number;
}

export const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const storageKey = useMemo(() => url, [url]);

    const abortControllerRef = useRef<AbortController | null>(null);

    const retryTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        abortControllerRef.current = new AbortController();
        setIsError(false);
        const fetchData = async (currentRetry = 0) => {
            const currentTime = new Date().getTime();
            const cachedItem = localStorage.getItem(storageKey);

            if (cachedItem) {
                try {
                    const cachedData: CacheEntry<T> = JSON.parse(cachedItem);

                    if (currentTime - cachedData.lastFetched < STALE_TIME) {
                        setData(cachedData.data);
                        setIsPending(false);
                        return;
                    }
                } catch {
                    localStorage.removeItem(storageKey);
                }
            }
            setIsPending(true);

            try {
                const response = await fetch(url, {
                    signal: abortControllerRef.current?.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const newData = (await response.json()) as T;
                setData(newData);

                const newCacheEntry: CacheEntry<T> = {
                    data: newData,
                    lastFetched: new Date().getTime(),
                };

                localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('요청 취소됨', url);

                    return;
                }

                if (currentRetry < MAX_RETRIES) {
                    const retryDelay =
                        INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);
                    retryTimeoutRef.current = setTimeout(() => {
                        fetchData(currentRetry + 1);
                    }, retryDelay);
                } else {
                    setIsError(true);
                    setIsPending(false);
                    return;
                }

                setIsError(true);
                console.log(error);
            } finally {
                setIsPending(false);
            }
        };
        fetchData();

        return () => {
            abortControllerRef.current?.abort();
            if (retryTimeoutRef.current !== null) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = null;
            }
        };
    }, [url, storageKey]);

    return { data, isPending, isError };
};
