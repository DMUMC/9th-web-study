import { useParams, Link } from 'react-router-dom';

const MovieDetailPage = () => {
    const { movieId } = useParams();

    return (
        <div className='mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-6 py-10'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold text-slate-900'>영화 상세</h1>
                <Link
                    className='rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50'
                    to='/'
                >
                    ← 목록으로
                </Link>
            </div>
            <div className='rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm'>
                <p className='text-base text-slate-700'>현재 경로: /movies/{movieId}</p>
                <p className='mt-2 text-sm text-slate-500'>디자인은 생략했으며, 라우팅 연결 확인용입니다.</p>
            </div>
        </div>
    );
};

export default MovieDetailPage;
