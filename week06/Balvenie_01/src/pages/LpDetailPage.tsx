import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';

const LpDetailPage = () => {
    const navigate = useNavigate();
    const { lpId } = useParams<{ lpId: string }>();

    const numericLpId = useMemo(() => {
        if (!lpId) return undefined;
        const parsed = Number(lpId);
        return Number.isNaN(parsed) ? undefined : parsed;
    }, [lpId]);

    const { data, isPending, isError } =
        useGetLpDetail(numericLpId);

    if (!numericLpId) {
        return (
            <div className='px-6 py-12 text-center text-red-500'>
                잘못된 LP ID 입니다.
            </div>
        );
    }

    if (isPending) {
        return (
            <div className='px-6 py-12 text-center text-gray-500'>
                데이터를 불러오는 중입니다...
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className='px-6 py-12 text-center text-red-500'>
                LP 정보를 불러오지 못했습니다.
            </div>
        );
    }

    const likesCount = data.likes?.length ?? 0;
    const formattedDate = new Intl.RelativeTimeFormat(
        'ko',
        {
            numeric: 'auto',
        }
    ).format(
        -Math.floor(
            (Date.now() -
                new Date(data.createdAt).getTime()) /
                (1000 * 60 * 60 * 24)
        ),
        'day'
    );

    return (
        <div className='mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-10'>
            <button
                type='button'
                onClick={() => navigate(-1)}
                className='mb-6 inline-flex items-center gap-2 rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300'
            >
                ← 목록으로
            </button>

            <article className='rounded-3xl bg-[#1f1f25] px-6 pb-10 pt-8 shadow-2xl sm:px-10'>
                <header className='flex flex-wrap items-start justify-between gap-4'>
                    <div className='flex items-center gap-4'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-full bg-teal-400 text-lg font-bold text-black'>
                            {data.author.name.charAt(0)}
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-gray-300'>
                                {data.author.name}
                            </p>
                            <h1 className='text-2xl font-bold text-white sm:text-3xl'>
                                {data.title}
                            </h1>
                        </div>
                    </div>
                    <div className='flex flex-col items-end gap-3 text-sm text-gray-400'>
                        <p>{formattedDate}</p>
                        <div className='flex flex-wrap items-center justify-end gap-2'>
                            <button
                                type='button'
                                className='inline-flex items-center gap-1 rounded-full border border-gray-600 px-3 py-1 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300'
                            >
                                <span>✏️</span>
                                수정
                            </button>
                            <button
                                type='button'
                                className='inline-flex items-center gap-1 rounded-full border border-red-400 px-3 py-1 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400'
                            >
                                <span>🗑️</span>
                                삭제
                            </button>
                            <button
                                type='button'
                                className='inline-flex items-center gap-1 rounded-full border border-pink-500 px-3 py-1 text-xs font-medium text-pink-300 transition-colors hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-400'
                            >
                                <span>♡</span>
                                {likesCount}
                            </button>
                        </div>
                    </div>
                </header>

                <div className='mt-8 flex justify-center'>
                    <div className='relative rounded-3xl bg-[#16161d] p-4 shadow-inner'>
                        <img
                            src={data.thumbnail}
                            alt={data.title}
                            className='h-[360px] w-[360px] rounded-3xl object-cover shadow-lg sm:h-[420px] sm:w-[420px]'
                        />
                    </div>
                </div>

                <section className='mt-8'>
                    <p className='text-center text-base leading-relaxed text-gray-300'>
                        {data.content}
                    </p>
                </section>

                {data.tags.length > 0 && (
                    <section className='mt-10 flex flex-wrap justify-center gap-2'>
                        {data.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className='rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-200'
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </section>
                )}
            </article>
        </div>
    );
};

export default LpDetailPage;