import { useEffect, useMemo, useRef, useState } from "react";
enabled?: boolean; // false면 자동요청 막기
};


export function useCustomFetch<T = any>({
url,
config,
deps = [],
transform,
enabled = true,
}: UseCustomFetchOptions<T>) {
const [data, setData] = useState<T | null>(null);
const [loading, setLoading] = useState<boolean>(false);
const [error, setError] = useState<unknown>(null);
const abortRef = useRef<AbortController | null>(null);


const doFetch = useMemo(() => {
return async () => {
if (!enabled) return;
try {
abortRef.current?.abort();
const ac = new AbortController();
abortRef.current = ac;


setLoading(true);
setError(null);


const { data } = await axios.get(url, {
signal: ac.signal,
...config,
});
const next = transform ? transform(data) : (data as T);
setData(next);
} catch (e: any) {
if (axios.isCancel(e)) return; // 취소는 무시
setError(e);
} finally {
setLoading(false);
}
};
}, [url, enabled, JSON.stringify(config), transform]);


// mount + deps/url 변경 시 재호출
useEffect(() => {
doFetch();
return () => abortRef.current?.abort();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [url, ...deps]);


const refetch = async () => {
await doFetch();
};


return { data, loading, error, refetch } as const;
}