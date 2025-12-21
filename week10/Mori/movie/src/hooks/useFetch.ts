import { useState, useEffect, useMemo } from "react";
import type { AxiosRequestConfig } from "axios";
import { axiosClient } from "../apis/axiosClients";

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const paramsString = useMemo(
    () => JSON.stringify(options?.params),
    [options?.params]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axiosClient.get(url, {
          ...options,
        });
        setData(data);
      } catch {
        setError("데이터를 가져오는데 에러가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, paramsString]);

  return { data, error, isLoading };
}

export default useFetch;