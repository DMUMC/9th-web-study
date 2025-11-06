import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { tmdb } from "../api/tmdb";

type UseCustomFetchOptions<TData> = {
  params?: Record<string, unknown>;
  enabled?: boolean;
  dependencies?: unknown[];
  initialData?: TData | null;
};

type UseCustomFetchReturn<TData> = {
  data: TData | null;
  loading: boolean;
  error: string | null;
};

export function useCustomFetch<TData>(
  endpoint: string | null,
  options: UseCustomFetchOptions<TData> = {},
): UseCustomFetchReturn<TData> {
  const { params, enabled = true, dependencies = [], initialData = null } = options;

  const [data, setData] = useState<TData | null>(initialData);
  const [loading, setLoading] = useState<boolean>(() => Boolean(enabled && endpoint));
  const [error, setError] = useState<string | null>(null);

  const paramsKey = useMemo(() => {
    if (!params) return "";

    try {
      const entries = Object.entries(params).sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0));
      return JSON.stringify(entries);
    } catch {
      return Math.random().toString(36);
    }
  }, [params]);

  useEffect(() => {
    if (!enabled || !endpoint) {
      setLoading(false);
      return;
    }

    let canceled = false;
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const url = endpoint as string;
        const response = await tmdb.get<TData>(url, {
          params,
          signal: controller.signal,
        });

        if (!canceled) {
          setData(response.data as TData);
        }
      } catch (err) {
        if (canceled) return;
        if (axios.isCancel(err)) return;

        const message =
          err instanceof Error ? err.message : "데이터를 불러오는 중 문제가 발생했습니다.";
        setError(message);
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      canceled = true;
      controller.abort();
    };
  }, [endpoint, enabled, paramsKey, ...dependencies]);

  return { data, loading, error };
}
