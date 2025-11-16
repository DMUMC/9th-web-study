import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList';
import type { Lp } from '../types/lp';
import { PAGINATION_ORDER } from '../enums/common';
import type { PAGINATION_ORDER as PaginationOrderType } from '../enums/common';
import { getImageUrl } from '../utils/image';

const sortOptions = [
    { label: '최신순', value: PAGINATION_ORDER.DESC },
    { label: '오래된순', value: PAGINATION_ORDER.ASC },
];

const SkeletonCard = () => (
    <div className="overflow-hidden rounded-xl bg-gray-900 shadow-lg">
        <div className="aspect-square w-full animate-pulse bg-gray-800" />
        <div className="p-4">
            <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-700" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-700" />
        </div>
    </div>
);

const SkeletonGrid = () => (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
        ))}
    </div>
);

const Homepage = () => {
    const [sortOrder, setSortOrder] = useState<PaginationOrderType>(
        PAGINATION_ORDER.DESC
    );
    const [likedLpIds, setLikedLpIds] = useState<Set<number>>(
        () => new Set<number>()
    );
    const navigate = useNavigate();
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const {
        data,
        isPending,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useGetInfiniteLpList({
        order: sortOrder,
        limit: 12,
    });

    const lpList: Lp[] = useMemo(() => {
        if (!data?.pages) return [];
        return data.pages.flatMap((page) => page.data.data ?? []);
    }, [data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !isFetchingNextPage
                ) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const formatDate = (value: string | Date) =>
        new Intl.DateTimeFormat('ko-KR').format(new Date(value));

    const renderEmpty = (
        <div className="mt-20 text-center text-gray-500">
            아직 등록된 LP가 없습니다. 첫 번째 LP를 추가해보세요!
        </div>
    );

    const toggleLike = (lpId: number) => {
        setLikedLpIds((prev) => {
            const next = new Set(prev);
            if (next.has(lpId)) {
                next.delete(lpId);
            } else {
                next.add(lpId);
            }
            return next;
        });
    };

    if (isPending) {
        return (
            <section className="space-y-6">
                <header className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        찾기
                    </h1>
                </header>
                <SkeletonGrid />
            </section>
        );
    }

    if (isError) {
        return (
            <div className="mt-20 space-y-4 text-center">
                <p className="text-red-500">
                    데이터를 불러오는 중 오류가 발생했습니다.
                </p>
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-gray-500">LP 탐색</p>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        찾기
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    {sortOptions.map((option) => {
                        const isActive = option.value === sortOrder;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setSortOrder(option.value)}
                                className={`rounded-full px-4 py-1 text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white text-gray-500 shadow'
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </header>

            {lpList.length === 0 && renderEmpty}

            {lpList.length > 0 && (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {lpList.map((lp) => {
                            const isLiked = likedLpIds.has(lp.id);
                            const likeCount =
                                (lp.likes?.length ?? 0) + (isLiked ? 1 : 0);

                            return (
                                <article
                                    key={lp.id}
                                    className="group relative cursor-pointer overflow-hidden rounded-xl bg-gray-900 shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-pink-500/40"
                                    onClick={() => {
                                        if (lp?.id) {
                                            navigate(`/lp/${lp.id}`);
                                        }
                                    }}
                                >
                                    <figure className="aspect-square w-full overflow-hidden bg-gray-800">
                                        {lp.thumbnail ? (
                                            <img
                                                src={getImageUrl(lp.thumbnail)}
                                                alt={`${lp.title} 앨범 커버`}
                                                className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900 text-sm text-white/70">
                                                이미지 준비 중
                                            </div>
                                        )}
                                    </figure>
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                                        <h2 className="truncate text-lg font-semibold text-white">
                                            {lp.title}
                                        </h2>
                                        <div className="mt-2 flex items-center justify-between text-sm text-white/80">
                                            <span>
                                                {formatDate(lp.createdAt)}
                                            </span>
                                            <button
                                                type="button"
                                                aria-pressed={isLiked}
                                                className={`flex items-center gap-1 rounded-full px-3 py-1 transition ${
                                                    isLiked
                                                        ? 'bg-pink-500 text-white'
                                                        : 'bg-white/20 text-white hover:bg-pink-500/80'
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleLike(lp.id);
                                                }}
                                            >
                                                <span aria-hidden>❤️</span>
                                                <span>{likeCount}</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div ref={loadMoreRef} className="py-8">
                        {isFetchingNextPage && <SkeletonGrid />}
                        {!hasNextPage && lpList.length > 0 && (
                            <p className="text-center text-sm text-gray-500">
                                모든 LP를 불러왔습니다.
                            </p>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default Homepage;
