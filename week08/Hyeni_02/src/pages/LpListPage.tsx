import { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { LpCard } from '../components/LpCard';
import { ErrorDisplay, LpCardSkeleton } from '../components/LoadingError';
import { getLpList } from '../apis/lpApi';
import type { Lp } from '../types/lp';
import { CreateLpModal } from '../components/CreateLpModal';
import { FloatingAddButton } from '../components/FloatingAddButton';
import { useDebounce } from '../hooks/useDebounce';

export const LpListPage = () => {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'tag'>('title');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const observerRef = useRef<HTMLDivElement>(null);

  const getSafeList = (pageData: any): Lp[] => {
    if (!pageData) return [];
    if (pageData.data && pageData.data.data && Array.isArray(pageData.data.data)) return pageData.data.data;
    if (pageData.data && Array.isArray(pageData.data)) return pageData.data;
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
    queryKey: ['lps', order, debouncedSearch, searchType], 
    
    queryFn: ({ pageParam }) => 
      getLpList({ 
        order, 
        cursor: pageParam as number | undefined, 
        limit: 10,
        search: debouncedSearch || undefined,
        searchType: searchType
      }),
      
    initialPageParam: undefined,

    getNextPageParam: (lastPage: any) => {
        if (lastPage.data?.nextCursor) return lastPage.data.nextCursor;
        if (lastPage.nextCursor) return lastPage.nextCursor;
        const items = getSafeList(lastPage); 
        if (items.length > 0) return items[items.length - 1].id; 
        return undefined; 
    },

    staleTime: 1000 * 60 * 1, 
    gcTime: 1000 * 60 * 5,    
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
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white p-4 md:p-8 relative flex flex-col items-center">
      
      <div className="w-full max-w-3xl mt-8 mb-12 flex flex-col gap-4 z-20">
          
          <div className="relative w-full">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             </div>

             <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchType === 'title' ? "제목으로 검색해보세요" : "태그로 검색해보세요 (# 없이 입력)"}
                className="w-full bg-[#1e1e1e] text-white pl-16 pr-32 py-4 rounded-full border border-[#333] focus:border-[#2c1ee9] focus:ring-1 focus:ring-[#2c1ee9] transition-all text-lg placeholder-gray-500 outline-none shadow-lg"
             />

             <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="relative">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="bg-[#2c2c2c] hover:bg-[#3a3a3a] text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all border border-[#444]"
                    >
                        {searchType === 'title' ? '제목' : '태그'}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-[#2c2c2c] border border-[#444] rounded-xl shadow-2xl overflow-hidden flex flex-col z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button 
                                onClick={() => { setSearchType('title'); setIsDropdownOpen(false); }} 
                                className={`px-4 py-3 text-left text-sm hover:bg-[#2c1ee9] hover:text-white transition-colors ${searchType === 'title' ? 'text-[#2c1ee9] font-bold' : 'text-gray-300'}`}
                            >
                                제목
                            </button>
                            <button 
                                onClick={() => { setSearchType('tag'); setIsDropdownOpen(false); }} 
                                className={`px-4 py-3 text-left text-sm hover:bg-[#2c1ee9] hover:text-white transition-colors ${searchType === 'tag' ? 'text-[#2c1ee9] font-bold' : 'text-gray-300'}`}
                            >
                                태그
                            </button>
                        </div>
                    )}
                </div>
             </div>
          </div>

          <div className="w-full px-4">
             <div className="flex items-center gap-3 mb-3">
               <span className="text-gray-500 text-sm font-medium">최근 검색어</span>
               <button onClick={() => alert('기록 삭제 기능 준비중')} className="text-xs text-gray-600 hover:text-gray-400 underline">모두 지우기</button>
             </div>
             <div className="flex gap-2 flex-wrap">
                <div className="bg-[#1e1e1e] text-gray-300 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 cursor-pointer hover:bg-[#333] hover:text-white transition-colors border border-[#333]">
                   타입스크립트 <button className="hover:text-[#e91e63]">×</button>
                </div>
             </div>
          </div>
      </div>

      <div className="w-full max-w-7xl">
          <div className="flex justify-end mb-6">
              <div className="flex bg-[#1e1e1e] rounded-lg p-1 border border-[#333]">
                <button onClick={() => setOrder('desc')} className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${order === 'desc' ? 'bg-[#2c1ee9] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>최신순</button>
                <button onClick={() => setOrder('asc')} className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${order === 'asc' ? 'bg-[#2c1ee9] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>오래된순</button>
              </div>
          </div>

          {isError && <ErrorDisplay message={error instanceof Error ? error.message : '알 수 없는 오류'} onRetry={refetch} />}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {isLoading && [...Array(10)].map((_, i) => <LpCardSkeleton key={`init-${i}`} />)}

            {!isLoading && !isError && data?.pages.map((page, i) => {
              const items = getSafeList(page);
              return items.map((lp) => <LpCard key={`${lp.id}-${i}`} lp={lp} />);
            })}

            {isFetchingNextPage && [...Array(5)].map((_, i) => <LpCardSkeleton key={`fetch-${i}`} />)}
          </div>

          {!isLoading && !isError && data?.pages[0] && getSafeList(data.pages[0]).length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                <p className="text-xl mb-2">🔍</p>
                <p>{debouncedSearch ? `'${debouncedSearch}'에 대한 검색 결과가 없습니다.` : '등록된 LP가 없습니다.'}</p>
            </div>
          )}

          {!isLoading && <div ref={observerRef} className="h-10 w-full" />}
      </div>

      <div className="fixed bottom-6 right-6 z-40" onClick={() => setIsModalOpen(true)}>
           <FloatingAddButton /> 
      </div>
      {isModalOpen && <CreateLpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};