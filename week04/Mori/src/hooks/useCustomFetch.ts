import { useState, useEffect } from 'react';
import { apiClient } from '../util/AxiosInstance';

interface FetchResult<T> {
  data: T | null; 
  isPending: boolean; 
  isError: boolean; 
}

export const useCustomFetch = <T>(url: string): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      
      try {
        const response = await apiClient.get<T>(url);
        setData(response.data);
      } catch {
        console.error();
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, isPending, isError };
};