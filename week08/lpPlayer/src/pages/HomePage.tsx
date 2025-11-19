import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLpListQuery } from '../hooks/queries/useLpListQuery';
import { LpCard } from '../components/LpCard';
import { LpSkeleton } from '../components/LpSkeleton';
import { StateMessage } from '../components/StateMessage';
import { useDebounce } from '../hooks/useDebounce';
import { SearchIcon } from '../components/icons/SearchIcon';

export const HomePage = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const normalizedQuery = debouncedQuery.trim();
  const isSearchMode = normalizedQuery.length > 0;
  const navigate = useNavigate();
  const defaultQuery = useLpListQuery(order, { enabled: !isSearchMode });
  const searchQuery = useLpListQuery(order, { search: normalizedQuery, enabled: isSearchMode });
  const listQuery = isSearchMode ? searchQuery : defaultQuery;
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = listQuery;
  const list = useMemo(() => data?.pages.flatMap((page) => page.data?.data ?? []) ?? [], [data]);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return undefined;
    const node = loadMoreRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 },
    );

    observer.observe(node);
    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-600">vinyl archive</p>
          <h1 className="mt-2 text-4xl font-black text-white">돌려돌려 LP 판</h1>
          <p className="mt-1 text-sm text-neutral-400">어디서도 볼 수 없는 LP 커버를 모아 감상해보세요.</p>
        </div>
      </section>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="LP 제목이나 내용을 검색해보세요"
            className="w-full rounded-full border border-white/10 bg-white/5 px-11 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-white/50 focus:outline-none"
          />
        </div>
        <div className="inline-flex items-center rounded-full bg-white/5 p-1 text-sm font-semibold">
          {[
            { value: 'asc', label: '오래된순' },
            { value: 'desc', label: '최신순' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setOrder(option.value as 'asc' | 'desc')}
              className={`rounded-full px-4 py-2 transition-all ${
                order === option.value ? 'bg-white text-black shadow-sm' : 'text-neutral-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {isFetching && !isLoading && (
        <p className="text-right text-xs text-neutral-500">새로운 데이터를 불러오는 중...</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <LpSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <StateMessage
          title="LP 목록을 불러오지 못했어요"
          description="네트워크 상태를 확인한 후 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={refetch}
        />
      ) : list.length === 0 ? (
        <StateMessage
          title={isSearchMode ? '검색 결과가 없습니다' : '등록된 LP가 없습니다'}
          description={
            isSearchMode
              ? '다른 키워드로 다시 검색해보세요.'
              : '첫 번째 LP를 업로드해 커뮤니티를 채워보세요.'
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((lp) => (
            <LpCard key={lp.id} lp={lp} onClick={() => navigate(`/lp/${lp.id}`)} />
          ))}
        </div>
      )}

      {isFetchingNextPage && !isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <LpSkeleton key={`next-${index}`} />
          ))}
        </div>
      )}

      <div ref={loadMoreRef} className="h-12 w-full" />
    </div>
  );
};
