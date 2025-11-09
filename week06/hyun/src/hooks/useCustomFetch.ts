import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { User } from './types';

const STALE_TIME = 5 * 60 * 1000;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1초

interface CacheEntry<T> {
    data: T;
    lastFetched: number;
}

/**
 * React Query의 기능을 모방하여 데이터 패칭을 처리하는 커스텀 훅
 * @param url 데이터를 가져올 API URL
 */
export const useCustomFetch = <T extends User>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    // 경쟁 상태 방지를 위한 AbortController (요청 취소)
    const abortControllerRef = useRef<AbortController | null>(null);
    // 재시도 타이머 관리
    const retryTimeoutRef = useRef<number | null>(null);

    // URL을 기반으로 캐시 키 생성
    const storageKey = useMemo(() => `cache-${url}`, [url]);

    const fetchData = useCallback(
        async (currentRetry = 0) => {
            // 1. 기존 타이머 및 요청 취소
            if (retryTimeoutRef.current !== null) {
                clearTimeout(retryTimeoutRef.current);
                retryTimeoutRef.current = null;
            }

            const cachedItem = localStorage.getItem(storageKey);
            const currentTime = new Date().getTime();

            // 2. 캐시 확인 및 사용 (Stale-While-Revalidate 모방)
            if (cachedItem) {
                try {
                    const cachedData = JSON.parse(cachedItem) as CacheEntry<T>;

                    if (currentTime - cachedData.lastFetched < STALE_TIME) {
                        // 캐시가 신선한 경우: 캐시 데이터 사용 후 네트워크 요청 없이 종료
                        setData(cachedData.data);
                        setIsPending(false);
                        return;
                    } else {
                        // 캐시가 만료된 경우: 일단 캐시 데이터를 보여주고, 아래에서 새 네트워크 요청 시작
                        setData(cachedData.data);
                    }
                } catch (e) {
                    // 캐시 데이터가 깨진 경우 제거
                    localStorage.removeItem(storageKey);
                }
            }

            // 3. 네트워크 요청 준비
            if (currentRetry === 0) {
                setIsPending(true);
                setIsError(false);
            }
            abortControllerRef.current = new AbortController();

            try {
                const response = await fetch(url, {
                    signal: abortControllerRef.current.signal, // 요청 시그널 전달
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch data with status: ${response.status}`
                    );
                }

                const newData = await response.json();
                setData(newData as T);

                // 성공 후 캐시 저장
                const newCacheEntry: CacheEntry<T> = {
                    data: newData as T,
                    lastFetched: new Date().getTime(),
                };
                localStorage.setItem(storageKey, JSON.stringify(newCacheEntry));
            } catch (error) {
                // 4. 에러 발생 및 재시도 로직
                if (currentRetry < MAX_RETRIES) {
                    // 지수 백오프 전략 (지연 시간은 1초, 2초, 4초...로 증가)
                    const retryDelay =
                        INITIAL_RETRY_DELAY * Math.pow(2, currentRetry);

                    console.log(
                        `제시도 ${
                            currentRetry + 1
                        }/${MAX_RETRIES}, 딜레이: ${retryDelay}ms`
                    );

                    // 타이머를 사용하여 지연 후 재귀적으로 재시도
                    retryTimeoutRef.current = window.setTimeout(() => {
                        fetchData(currentRetry + 1);
                    }, retryDelay);

                    return; // 재시도 예정이므로 바로 종료
                }

                // 요청 취소 에러 처리 (AbortError)
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('요청 취소됨 (경쟁 상태 방지)');
                } else {
                    // 최대 재시도 횟수 초과 또는 최종 에러
                    console.error('최종 에러 발생:', error);
                    setIsError(true);
                }
            } finally {
                // 네트워크 요청 완료 시 로딩 상태 해제
                setIsPending(false);
            }
        },
        [url, storageKey]
    );

    useEffect(() => {
        fetchData();

        // 클린업 함수: 언마운트 시 진행 중인 요청 및 타이머 정리
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (retryTimeoutRef.current !== null) {
                clearTimeout(retryTimeoutRef.current);
            }
        };
    }, [fetchData]);

    return { data, isPending, isError };
};
