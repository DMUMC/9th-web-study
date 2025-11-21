import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import SkeletonCard from '../components/SkeletonCard';
import useGetInfiniteLpList from '../hooks/queries/useGetInfiniteLpList';
import AddLpModal from '../components/AddLpModal';

const SKELETON_BASE_COUNT = 8;

const HomePage = () => {
    const [sortOrder, setSortOrder] = useState<
        'desc' | 'asc'
    >('desc');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { ref, inView } = useInView();

    const {
        data,
        isPending,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
    } = useGetInfiniteLpList(20, search, sortOrder);

    const lps = useMemo(
        () =>
            data?.pages.flatMap(
                (page) => page.data.data ?? []
            ) ?? [],
        [data]
    );

    useEffect(() => {
        if (!inView) return;
        if (!hasNextPage) return;
        if (isFetchingNextPage) return;

        fetchNextPage();
    }, [
        fetchNextPage,
        hasNextPage,
        inView,
        isFetchingNextPage,
    ]);

    const getRelativeTime = (value: string | Date) => {
        const now = Date.now();
        const target = new Date(value).getTime();
        const diffMs = now - target;

        const diffMinutes = Math.round(
            diffMs / (1000 * 60)
        );
        if (diffMinutes < 1) return '방금 전';
        if (diffMinutes < 60) return `${diffMinutes}분 전`;

        const diffHours = Math.round(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}시간 전`;

        const diffDays = Math.round(diffHours / 24);
        if (diffDays < 7) return `${diffDays}일 전`;

        const diffWeeks = Math.round(diffDays / 7);
        if (diffWeeks < 5) return `${diffWeeks}주 전`;

        const diffMonths = Math.round(diffDays / 30);
        if (diffMonths < 12) return `${diffMonths}개월 전`;

        const diffYears = Math.round(diffDays / 365);
        return `${diffYears}년 전`;
    };

    const isSkeletonVisible =
        isPending || (isFetching && !data);

    if (isSkeletonVisible) {
        return (
            <div className='mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8'>
                <div className='mb-6 flex w-full items-center gap-3'>
                    <div className='h-10 w-full animate-pulse rounded-lg bg-gray-200' />
                </div>
                <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                    <div className='h-8 w-32 animate-pulse rounded bg-gray-200' />
                    <div className='flex items-center gap-2'>
                        <div className='h-9 w-24 animate-pulse rounded-full border border-gray-200 bg-gray-100' />
                        <div className='h-9 w-24 animate-pulse rounded-full border border-gray-200 bg-gray-100' />
                    </div>
                </div>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'>
                    {Array.from({
                        length: SKELETON_BASE_COUNT,
                    }).map((_, index) => (
                        <SkeletonCard
                            key={`lp-skeleton-${index}`}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className='px-6 py-10 text-center text-red-500'>
                목록을 불러오지 못했습니다.
            </div>
        );
    }

    return (
        <div className='mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8'>
            <div className='mb-6 flex w-full items-center gap-3'>
                <input
                    type='search'
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    placeholder='검색어를 입력하세요'
                    className='w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                />
            </div>
            <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                    LP 목록
                </h1>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => setSortOrder('desc')}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                            sortOrder === 'desc'
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-blue-500 bg-white text-blue-500 hover:bg-blue-50'
                        }`}
                    >
                        최신순
                    </button>
                    <button
                        type='button'
                        onClick={() => setSortOrder('asc')}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                            sortOrder === 'asc'
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-blue-500 bg-white text-blue-500 hover:bg-blue-50'
                        }`}
                    >
                        오래된순
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'>
                {lps.map((lp) => {
                    const likesCount =
                        lp.likes?.length ?? 0;
                    return (
                        <Link
                            key={lp.id}
                            to={`/lp/${lp.id}`}
                            className='group relative aspect-square overflow-hidden rounded-lg border-2 border-transparent shadow-sm transition-all hover:border-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400'
                        >
                            <img
                                src={lp.thumbnail}
                                alt={lp.title}
                                className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-105'
                            />
                            <div className='pointer-events-none absolute inset-0 flex flex-col justify-between bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/75 group-hover:opacity-100 group-focus-visible:bg-black/75 group-focus-visible:opacity-100'>
                                <div className='p-3 text-left text-white'>
                                    <p className='text-sm font-semibold leading-snug line-clamp-2'>
                                        {lp.title}
                                    </p>
                                </div>
                                <div className='flex items-center justify-between px-3 pb-3 text-xs text-gray-200'>
                                    <span>
                                        {getRelativeTime(
                                            lp.createdAt
                                        )}
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <span className='text-sm'>
                                            ♡
                                        </span>
                                        {likesCount}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
                {isFetchingNextPage &&
                    Array.from({ length: 4 }).map(
                        (_, index) => (
                            <SkeletonCard
                                key={`lp-next-skeleton-${index}`}
                            />
                        )
                    )}
            </div>
            {lps.length === 0 && !isFetching && (
                <div className='py-16 text-center text-sm text-gray-500'>
                    표시할 LP가 없습니다.
                </div>
            )}
            <div ref={ref} className='h-1 w-full' />
            {hasNextPage && (
                <div className='py-6 text-center text-sm text-gray-500'>
                    {isFetchingNextPage
                        ? '불러오는 중...'
                        : '아래로 스크롤해 더 보기'}
                </div>
            )}
            <button
                type='button'
                onClick={() => setIsModalOpen(true)}
                className='fixed right-6 bottom-6 rounded-full px-5 py-3 bg-blue-500 text-white border-0 shadow-lg cursor-pointer focus:outline-none hover:bg-blue-600 transition-colors'
            >
                +
            </button>
            <AddLpModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default HomePage;
