import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import { useAuth } from '../context/AuthContext';
import { createComment, getComments } from '../apis/lp';
import type { Comment } from '../types/lp';

const LpDetailPage = () => {
    const { lpId } = useParams<{ lpId: string }>();
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isPending, isError, refetch } = useGetLpDetail(lpId);

    const lp = useMemo(() => data?.data, [data]);

    useEffect(() => {
        setIsLiked(false);
        setComments([]);
        if (lpId) {
            loadComments();
        }
    }, [lpId]);

    const loadComments = async () => {
        if (!lpId) return;
        setIsLoadingComments(true);
        try {
            // 임시: UI 확인을 위한 더미 댓글 데이터
            const dummyComments: Comment[] = [
                {
                    id: 1,
                    content: '정말 좋은 LP네요! 추천합니다.',
                    userId: 1,
                    lpId: Number(lpId),
                    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
                    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                },
                {
                    id: 2,
                    content: '이 앨범은 제가 가장 좋아하는 작품 중 하나입니다. 감사합니다!',
                    userId: 2,
                    lpId: Number(lpId),
                    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
                    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
                },
                {
                    id: 3,
                    content: '음질이 정말 좋네요. 계속 듣고 싶어요.',
                    userId: 3,
                    lpId: Number(lpId),
                    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
                    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
                {
                    id: 4,
                    content: '다음 작품도 기대됩니다!',
                    userId: 4,
                    lpId: Number(lpId),
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2일 전
                    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                },
                {
                    id: 5,
                    content: '이런 스타일의 음악을 좋아하는데 정말 마음에 들어요.',
                    userId: 5,
                    lpId: Number(lpId),
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
                    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                },
            ];

            // 실제 API 호출 대신 더미 데이터 사용
            // const response = await getComments(lpId);
            // const commentsData = response?.data;
            // const commentsArray = Array.isArray(commentsData) ? commentsData : [];
            
            setComments(dummyComments);
        } catch (error) {
            console.error('댓글 로딩 실패:', error);
            setComments([]);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim() || !lpId || isSubmitting) return;

        // ProtectedLayout에서 이미 로그인 체크를 하므로 이 부분은 불필요하지만,
        // 혹시 모를 상황을 대비해 유지

        setIsSubmitting(true);
        try {
            // 임시: UI 확인을 위한 더미 댓글 추가
            const newComment: Comment = {
                id: Date.now(), // 임시 ID
                content: commentInput.trim(),
                userId: 999, // 임시 사용자 ID
                lpId: Number(lpId),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            
            // 실제 API 호출 대신 더미 데이터에 추가
            // await createComment(lpId, commentInput.trim());
            setComments((prev) => [newComment, ...prev]);
            setCommentInput('');
            
            // await loadComments();
        } catch (error) {
            console.error('댓글 작성 실패:', error);
            alert('댓글 작성에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const formatCommentDate = (date: string | Date) =>
        new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(date));

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

            <section className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        댓글 ({Array.isArray(comments) ? comments.length : 0})
                    </h2>
                    {Array.isArray(comments) && comments.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setCommentOrder('desc')}
                                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                                    commentOrder === 'desc'
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                최신순
                            </button>
                            <button
                                type="button"
                                onClick={() => setCommentOrder('asc')}
                                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                                    commentOrder === 'asc'
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                오래된순
                            </button>
                        </div>
                    )}
                </div>

                {accessToken ? (
                    <form onSubmit={handleSubmitComment} className="mb-6">
                        <div className="flex gap-2">
                            <textarea
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder="댓글을 입력해주세요"
                                className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                rows={3}
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!commentInput.trim() || isSubmitting}
                                className="rounded-md bg-pink-500 px-6 py-2 text-white transition hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? '작성 중...' : '작성'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                        <p className="text-sm text-gray-600">
                            댓글을 작성하려면{' '}
                            <button
                                type="button"
                                onClick={() => {
                                    const redirect = encodeURIComponent(
                                        location.pathname
                                    );
                                    navigate(`/login?redirect=${redirect}`);
                                }}
                                className="text-pink-500 hover:underline"
                            >
                                로그인
                            </button>
                            이 필요합니다.
                        </p>
                    </div>
                )}

                {isLoadingComments ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse space-y-2 rounded-lg border border-gray-200 p-4"
                            >
                                <div className="h-4 w-1/4 rounded bg-gray-200" />
                                <div className="h-4 w-full rounded bg-gray-200" />
                                <div className="h-3 w-1/3 rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                ) : !Array.isArray(comments) || comments.length === 0 ? (
                    <p className="text-center text-gray-500">
                        아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {[...comments]
                            .sort((a, b) => {
                                const dateA = new Date(a.createdAt).getTime();
                                const dateB = new Date(b.createdAt).getTime();
                                return commentOrder === 'desc'
                                    ? dateB - dateA
                                    : dateA - dateB;
                            })
                            .map((comment) => {
                                const userName = `사용자 #${comment.userId}`;
                                const initials = userName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);

                                return (
                                    <div
                                        key={comment.id}
                                        className="flex gap-3 rounded-lg border border-gray-200 p-4"
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-medium text-white">
                                            {initials}
                                        </div>
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900">
                                                    {userName}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">
                                                        {formatCommentDate(
                                                            comment.createdAt
                                                        )}
                                                    </span>
                                                    {accessToken && (
                                                        <button
                                                            type="button"
                                                            className="text-gray-400 hover:text-gray-600"
                                                            aria-label="댓글 옵션"
                                                        >
                                                            <svg
                                                                className="h-5 w-5"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-800">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </section>
        </article>
    );
};

export default LpDetailPage;
