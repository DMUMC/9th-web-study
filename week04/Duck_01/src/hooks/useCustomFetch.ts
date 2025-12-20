import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../utils/utils";

interface UseCustomFetchOptions {
  url: string;
  params?: Record<string, string | number>;
  enabled?: boolean;
}

interface UseCustomFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCustomFetch = <T>({
  url,
  params = {},
  enabled = true,
}: UseCustomFetchOptions): UseCustomFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // params를 ref로 저장하여 안정화
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.get<T>(url, { params: paramsRef.current });
      setData(response.data);
    } catch (err) {
      console.error("API 호출 중 에러 발생:", err);
      setError("데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  // 의존성 변경 시 자동으로 데이터 재요청
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
