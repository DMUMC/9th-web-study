import { useEffect, useState } from 'react';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';


export default function useCustomFetch<T>(
  url?: string,
  deps: unknown[] = [],
  config?: AxiosRequestConfig
) {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();
    setIsPending(true);
    setIsError(false);

    axios
      .get<T>(url, { signal: controller.signal, ...(config || {}) })
      .then(({ data }) => {
        setData(data);
      })
      .catch((err: any) => {
        // 사용자가 페이지 이동/탭 전환으로 취소한 경우는 에러로 치지 않음
        if (axios.isCancel(err) || err?.name === 'CanceledError') return;
        setIsError(true);
      })
      .finally(() => setIsPending(false));

    return () => controller.abort();
  }, [url, ...deps]);

  return { data, isPending, isError };
}
