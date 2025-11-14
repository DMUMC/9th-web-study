import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import { useAuth } from '../context/AuthContext';

const LpDetailPage = () => {
    const { lpId } = useParams<{ lpId: string }>();
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [guardPassed, setGuardPassed] = useState<boolean>(Boolean(accessToken));
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!accessToken) {
            const shouldLogin = window.confirm(
                'LP 상세는 로그인 후 이용 가능합니다. 로그인하시겠습니까?'
            );
            if (shouldLogin) {
                const redirect = encodeURIComponent(location.pathname);
                navigate(`/login?redirect=${redirect}`);
            } else {
                navigate(-1);
            }
        } else {
            setGuardPassed(true);
        }
    }, [accessToken, location.pathname, navigate]);

    const { data, isPending, isError, refetch } = useGetLpDetail(
        guardPassed ? lpId : undefined
    );

    const lp = useMemo(() => data?.data, [data]);

    useEffect(() => {
        setIsLiked(false);
    }, [lpId]);

    if (!guardPassed) {
        return null;
    }

    if (isPending) {
        return (
            <div className="space-y-4 rounded-xl bg-white p-6 shadow">
                <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
            </div>
        );
    }

    if (isError || !lp) {
        return (
            <div className="space-y-4 rounded-xl bg-white p-6 text-center shadow">
                <p className="text-red-500">
                    LP 정보를 불러오지 못했습니다. 다시 시도해주세요.
                </p>
                <button
                    type="button"
                    className="rounded-md bg-gray-900 px-4 py-2 text-white"
                    onClick={() => refetch()}
                >
                    다시 시도
                </button>
            </div>
        );
    }

    const formattedDate = new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'long',
    }).format(new Date(lp.createdAt));

    return (
        <article className="space-y-6 rounded-xl bg-white p-6 shadow-lg">
            <button
                type="button"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
                onClick={() => navigate(-1)}
            >
                ← 뒤로가기
            </button>
            <header className="space-y-2 border-b pb-4">
                <p className="text-sm text-gray-500">{formattedDate}</p>
                <h1 className="text-3xl font-bold text-gray-900">{lp.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span>작성자 #{lp.authorId}</span>
                    <span>좋아요 {lp.likes?.length ?? 0}</span>
                    <span>{lp.published ? '공개' : '비공개'}</span>
                </div>
                {lp.tags && lp.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {lp.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                            >
                                #{tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </header>

            <figure className="overflow-hidden rounded-xl bg-gray-100">
                {lp.thumbnail ? (
                    <img
                        src={lp.thumbnail}
                        alt={`${lp.title} 앨범 이미지`}
                        className="w-full object-cover"
                    />
                ) : (
                    <div className="flex h-72 items-center justify-center text-gray-400">
                        썸네일 이미지가 없습니다.
                    </div>
                )}
            </figure>

            <section className="whitespace-pre-line text-gray-800 leading-relaxed">
                {lp.content}
            </section>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                >
                    수정
                </button>
                <button
                    type="button"
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                >
                    삭제
                </button>
                <button
                    type="button"
                    aria-pressed={isLiked}
                    className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                        isLiked ? 'bg-pink-600' : 'bg-pink-500'
                    }`}
                    onClick={() => setIsLiked((prev) => !prev)}
                >
                    {isLiked ? '좋아요 취소' : '좋아요'}{' '}
                    {(lp.likes?.length ?? 0) + (isLiked ? 1 : 0)}
                </button>
            </div>
        </article>
    );
};

export default LpDetailPage;

