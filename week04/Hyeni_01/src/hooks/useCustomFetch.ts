import { useState, useEffect } from 'react';
import axios, { type AxiosRequestConfig } from 'axios';

const defaultOptions: AxiosRequestConfig = {
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    accept: 'application/json',
  },
};

export const useCustomFetch = <T>(url: string, options: AxiosRequestConfig = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsPending(true);
      setError(null);
      try {
        const response = await axios.get(url, {
          ...defaultOptions,
          ...options,
          signal: controller.signal,
        });
        setData(response.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else {
          console.error(err);
          setError('데이터를 불러오는 데 실패했습니다.');
        }
      } finally {
        setIsPending(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, JSON.stringify(options)]);

  return { data, isPending, error };
};