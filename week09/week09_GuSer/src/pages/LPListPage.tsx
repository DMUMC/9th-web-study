import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getLPs, type LPListResponse, type LP } from '../apis/lp';
import LPCard from '../components/LPCard/LPCard';
import LPSkeleton from '../components/Skeleton/LPSkeleton';

const LPListPage = () => {
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['lps', sort],
    queryFn: ({ pageParam }) => getLPs(pageParam, sort),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  });

  // 서버 응답 구조에 따라 안전하게 데이터 추출
  const lps = data?.pages.flatMap((page: LPListResponse) => {
    if (!page) return [];
    
    // page가 객체이고 lps 속성이 있는 경우
    if (typeof page === 'object' && 'lps' in page) {
      const pageLps = page.lps;
      return Array.isArray(pageLps) ? pageLps.filter((lp: LP) => lp && lp.id) : [];
    }
    
    return [];
  }) ?? [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <LPSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">LP 목록을 불러오는 중 오류가 발생했습니다.</p>
        {error && (
          <p className="text-red-300 text-sm mt-2">
            {error instanceof Error ? error.message : '알 수 없는 오류'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold">LP 목록</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setSort('desc')}
            className={`px-4 py-2 rounded-md transition-colors ${
              sort === 'desc'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSort('asc')}
            className={`px-4 py-2 rounded-md transition-colors ${
              sort === 'asc'
                ? 'bg-pink-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            오래된순
          </button>
        </div>
      </div>

      {lps.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400">LP가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lps.map((lp: LP) => {
              if (!lp || !lp.id) return null;
              return <LPCard key={lp.id} lp={lp} />;
            })}
          </div>

          <div ref={observerTarget} className="h-10" />

          {isFetchingNextPage && <LPSkeleton />}
        </>
      )}
    </div>
  );
};

export default LPListPage;

