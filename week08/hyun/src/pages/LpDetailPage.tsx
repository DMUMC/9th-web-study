import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import useGetComments from '../hooks/queries/useGetComments';
import useCreateComment from '../hooks/mutations/useCreateComment';
import useDeleteLP from '../hooks/mutations/useDeleteLP';
import useToggleLike from '../hooks/mutations/useToggleLike';
import { useAuth } from '../context/AuthContext';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import CommentItem from '../components/CommentItem';
import { getImageUrl } from '../utils/image';

const LpDetailPage = () => {
    const { lpId } = useParams<{ lpId: string }>();
    const { accessToken } = useAuth();
    const { data: myInfo } = useGetMyInfo();
    const navigate = useNavigate();
    const location = useLocation();
    const [commentInput, setCommentInput] = useState('');
    const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');

    const { data, isPending, isError, refetch } = useGetLpDetail(lpId);
    const {
        data: comments = [],
        isLoading: isLoadingComments,
        refetch: refetchComments,
    } = useGetComments(lpId, commentOrder);

    // 디버깅: 댓글 데이터 확인
    console.log(
        'LpDetailPage - comments:',
        comments,
        'length:',
        comments?.length
    );
    const { mutate: createComment, isPending: isSubmitting } =
        useCreateComment();
    const { mutate: deleteLP, isPending: isDeletingLP } = useDeleteLP();
    const { mutate: toggleLike, isPending: isTogglingLike } = useToggleLike();

    const lp = useMemo(() => data?.data, [data]);

    // 현재 사용자가 게시글 작성자인지 확인
    const isAuthor = useMemo(() => {
        if (!lp || !myInfo?.data?.id) return false;
        return lp.authorId === myInfo.data.id;
    }, [lp, myInfo]);

    // 현재 사용자가 좋아요를 눌렀는지 확인
    const isLiked = useMemo(() => {
        if (!lp || !myInfo?.data?.id) return false;
        return (
            lp.likes?.some((like) => like.userId === myInfo.data.id) ?? false
        );
    }, [lp, myInfo]);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim() || !lpId || isSubmitting) return;

        createComment(
            {
                lpId,
                content: commentInput.trim(),
            },
            {
                onSuccess: () => {
                    setCommentInput('');
                    // 댓글 목록 즉시 새로고침
                    refetchComments();
                },
                onError: (error) => {
                    console.error('댓글 작성 실패:', error);
                    alert('댓글 작성에 실패했습니다.');
                },
            }
        );
    };

    const handleDeleteLP = () => {
        if (!lpId || !confirm('정말 이 LP를 삭제하시겠습니까?')) return;
        deleteLP(lpId, {
            onSuccess: () => {
                navigate('/');
            },
            onError: (error) => {
                console.error('LP 삭제 실패:', error);
                alert('LP 삭제에 실패했습니다.');
            },
        });
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

            <figure className="flex justify-center overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                {lp.thumbnail ? (
                    <img
                        src={getImageUrl(lp.thumbnail)}
                        alt={`${lp.title} 앨범 이미지`}
                        className="max-h-[70vh] w-full max-w-4xl object-contain"
                    />
                ) : (
                    <div className="flex h-72 w-full items-center justify-center text-gray-400">
                        썸네일 이미지가 없습니다.
                    </div>
                )}
            </figure>

            <section className="whitespace-pre-line text-gray-800 leading-relaxed">
                {lp.content}
            </section>

            <div className="flex flex-wrap gap-3">
                {isAuthor && (
                    <>
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                            onClick={() => navigate(`/lp/${lpId}/edit`)}
                        >
                            수정
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteLP}
                            disabled={isDeletingLP}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
                        >
                            {isDeletingLP ? '삭제 중...' : '삭제'}
                        </button>
                    </>
                )}
                <button
                    type="button"
                    aria-pressed={isLiked}
                    disabled={isTogglingLike || !accessToken}
                    className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                        isLiked
                            ? 'bg-pink-600 text-white'
                            : 'bg-pink-500 text-white hover:bg-pink-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={() => {
                        if (lpId) {
                            toggleLike({ lpId, isLiked });
                        }
                    }}
                >
                    {isTogglingLike ? (
                        <span className="text-xs">처리 중...</span>
                    ) : (
                        <>
                            {isLiked ? (
                                <svg
                                    className="h-5 w-5 fill-current"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            ) : (
                                <svg
                                    className="h-5 w-5 fill-none stroke-current stroke-2"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            )}
                            <span>{lp.likes?.length ?? 0}</span>
                        </>
                    )}
                </button>
            </div>

            <section className="border-t pt-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        댓글 ({comments.length})
                    </h2>
                    {comments.length > 0 && (
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
                                onChange={(e) =>
                                    setCommentInput(e.target.value)
                                }
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
                ) : comments.length === 0 ? (
                    <p className="text-center text-gray-500">
                        아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                lpId={lpId!}
                                formatDate={formatCommentDate}
                            />
                        ))}
                    </div>
                )}
            </section>
        </article>
    );
};

export default LpDetailPage;
