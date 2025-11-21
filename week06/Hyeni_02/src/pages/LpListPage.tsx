import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type PaginationDto } from '../types/common';
import { LpCard } from '../components/LpCard';
import { ErrorDisplay, LpCardSkeleton } from '../components/LoadingError';
import type { Lp } from '../types/lp';
import { getLpList } from '../apis/lpApi';

export const LpListPage = () => {
  const [pagination, setPagination] = useState<PaginationDto>({ order: 'desc' });

  const { 
    data: responseData, 
    isLoading, 
    isError, 
    error, 
    refetch, 
  } = useQuery({
    queryKey: ['lps', pagination], 
    queryFn: () => getLpList(pagination),
  });

  const getSafeList = (data: any): Lp[] => {
    if (!data) return [];
    
    if (Array.isArray(data)) return data;
    
    if (data.data && Array.isArray(data.data)) return data.data;
    
    if (data.data && data.data.data && Array.isArray(data.data.data)) {
      return data.data.data;
    }

    console.warn('데이터 형식을 파악할 수 없습니다:', data);
    return [];
  };

  const lpList = getSafeList(responseData);

  const handleSortChange = (newOrder: 'desc' | 'asc') => {
    setPagination(prev => ({ ...prev, order: newOrder }));
  };

  return (
    <div className="w-full max-w-7xl p-4 md:p-8">
      <div className="flex justify-end items-center mb-6 gap-2">
        <button
          onClick={() => handleSortChange('desc')}
          className={`px-4 py-2 rounded-md font-semibold transition-colors
            ${pagination.order === 'desc' ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`
          }
        >
          최신순
        </button>
        <button
          onClick={() => handleSortChange('asc')}
           className={`px-4 py-2 rounded-md font-semibold transition-colors
            ${pagination.order === 'asc' ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`
          }
        >
          오래된순
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, index) => (
            <LpCardSkeleton key={index} />
          ))}
        </div>
      )}

      {isError && (
        <ErrorDisplay 
          message={error instanceof Error ? error.message : '알 수 없는 오류'} 
          onRetry={refetch} 
        />
      )}

      {!isLoading && !isError && (
        lpList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {lpList.map((lp: Lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">
            등록된 LP가 없습니다.
          </div>
        )
      )}
    </div>
  );
};