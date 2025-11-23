import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LpCard } from '../components/LpCard';
import { ErrorDisplay, LpCardSkeleton } from '../components/LoadingError';
import { getLpList } from '../apis/lpApi';
import type { Lp } from '../types/lp';
import { CreateLpModal } from '../components/CreateLpModal';
import { FloatingAddButton } from '../components/FloatingAddButton';

export const LpListPage = () => {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const observerRef = useRef<HTMLDivElement>(null);

  const getSafeList = (pageData: any): Lp[] => {
    if (!pageData) return [];

    if (pageData.data && pageData.data.data && Array.isArray(pageData.data.data)) {
      return pageData.data.data;
    }

    if (pageData.data && Array.isArray(pageData.data)) {
      return pageData.data;
    }

    if (Array.isArray(pageData)) return pageData;

    return [];
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['lps', order], 
    
    queryFn: ({ pageParam }) => 
      getLpList({ 
        order, 
        cursor: pageParam as number | undefined, 
        limit: 10 
      }),
      
    initialPageParam: undefined,

    getNextPageParam: (lastPage: any) => {
        if (lastPage.nextCursor) return lastPage.nextCursor;
        if (lastPage.data?.nextCursor) return lastPage.data.nextCursor;

        const items = getSafeList(lastPage); 
        if (items.length > 0) {
            return items[items.length - 1].id; 
        }
        return undefined; 
    },
  });

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);


  return (
    <div className="w-full max-w-7xl p-4 md:p-8">
      <div className="flex justify-end items-center mb-6 gap-2">
        <button
          onClick={() => setOrder('desc')}
          className={`px-4 py-2 rounded-md font-semibold transition-colors
            ${order === 'desc' ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`
          }
        >
          최신순
        </button>
        <button
          onClick={() => setOrder('asc')}
           className={`px-4 py-2 rounded-md font-semibold transition-colors
            ${order === 'asc' ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`
          }
        >
          오래된순
        </button>
      </div>

      {isError && (
        <ErrorDisplay 
          message={error instanceof Error ? error.message : '알 수 없는 오류'} 
          onRetry={refetch} 
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        
        {isLoading && (
          [...Array(10)].map((_, index) => (
            <LpCardSkeleton key={`init-skeleton-${index}`} />
          ))
        )}

        {!isLoading && !isError && data?.pages.map((page, pageIndex) => {
          const items = getSafeList(page);
          return items.map((lp) => (
            <LpCard key={`${lp.id}-${pageIndex}`} lp={lp} />
          ));
        })}

        {isFetchingNextPage && (
          [...Array(5)].map((_, index) => (
            <LpCardSkeleton key={`fetch-skeleton-${index}`} />
          ))
        )}
      </div>

      {!isLoading && !isError && data?.pages[0] && getSafeList(data.pages[0]).length === 0 && (
         <div className="text-center text-gray-400 py-20 w-full col-span-full">
           등록된 LP가 없습니다.
         </div>
      )}

      {!isLoading && <div ref={observerRef} className="h-10 w-full" />}

      <div className="fixed bottom-6 right-6 z-40" onClick={() => setIsModalOpen(true)}>
           <FloatingAddButton /> 
       </div>

       {isModalOpen && <CreateLpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};