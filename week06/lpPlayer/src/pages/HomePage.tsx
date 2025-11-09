import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLpListQuery } from '../hooks/queries/useLpListQuery';
import { LpCard } from '../components/LpCard';
import { LpSkeleton } from '../components/LpSkeleton';
import { StateMessage } from '../components/StateMessage';

export const HomePage = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, refetch } = useLpListQuery(order);
  const list = useMemo(() => data?.data?.data ?? [], [data]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-600">vinyl archive</p>
          <h1 className="mt-2 text-4xl font-black text-white">돌려돌려 LP 판</h1>
          <p className="mt-1 text-sm text-neutral-400">어디서도 볼 수 없는 LP 커버를 모아 감상해보세요.</p>
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
                order === option.value
                  ? 'bg-white text-black shadow-sm'
                  : 'text-neutral-400'
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
          {Array.from({ length: 6 }).map((_, index) => (
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
          title="등록된 LP가 없습니다"
          description="첫 번째 LP를 업로드해 커뮤니티를 채워보세요."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((lp) => (
            <LpCard key={lp.id} lp={lp} onClick={() => navigate(`/lp/${lp.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
};
