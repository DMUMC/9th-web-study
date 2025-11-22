import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import LpCommentItem from '../components/LpCommentItem';
import SkeletonCard from '../components/SkeletonCard';
import EditLpModal from '../components/EditLpModal';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import useGetInfiniteLpComments from '../hooks/queries/useGetInfiniteLpComments';
import useCreateLpComment from '../hooks/mutations/useCreateLpComment';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import useDeleteLp from '../hooks/mutations/useDeleteLp';

const COMMENT_SKELETON_BASE_COUNT = 4;

const LpDetailPage = () => {
    const navigate = useNavigate();
    const { lpId } = useParams<{ lpId: string }>();

    const [commentOrder, setCommentOrder] = useState<
        'asc' | 'desc'
    >('asc');
    const [commentContent, setCommentContent] =
        useState('');

    const numericLpId = useMemo(() => {
        if (!lpId) return undefined;
        const parsed = Number(lpId);
        return Number.isNaN(parsed) ? undefined : parsed;
    }, [lpId]);

    const { data, isPending, isError } =
        useGetLpDetail(numericLpId);

    const { data: myInfo } = useGetMyInfo();
    const createLpCommentMutation = useCreateLpComment();
    const deleteLpMutation = useDeleteLp();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const {
        data: commentsData,
        isPending: areCommentsPending,
        isError: isCommentsError,
        fetchNextPage: fetchNextComments,
        hasNextPage: hasNextComments,
        isFetchingNextPage: isFetchingNextComments,
        isFetching: areCommentsFetching,
    } = useGetInfiniteLpComments(
        numericLpId,
        10,
        commentOrder
    );

    const { ref: commentsRef, inView: areCommentsInView } =
        useInView({
            rootMargin: '160px',
        });

    const comments = useMemo(
        () =>
            commentsData?.pages.flatMap(
                (page) => page.data.data ?? []
            ) ?? [],
        [commentsData]
    );

    useEffect(() => {
        if (!areCommentsInView) return;
        if (!hasNextComments) return;
        if (isFetchingNextComments) return;

        fetchNextComments();
    }, [
        areCommentsInView,
        fetchNextComments,
        hasNextComments,
        isFetchingNextComments,
    ]);

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

    const isCommentsSkeletonVisible =
        areCommentsPending ||
        (areCommentsFetching && !commentsData);

    const isCommentValid =
        commentContent.trim().length >= 5;
    const commentHelperText = isCommentValid
        ? '좋은 댓글 감사합니다!'
        : '댓글은 최소 5자 이상 입력해주세요.';

    const handleChangeCommentOrder = (
        order: 'asc' | 'desc'
    ) => {
        setCommentOrder(order);
    };

    const handleCommentSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!commentContent.trim() || !isCommentValid) {
            alert('댓글은 최소 5자 이상 입력해주세요.');
            return;
        }

        if (!numericLpId) {
            alert('LP ID가 없습니다.');
            return;
        }

        createLpCommentMutation.mutate(
            {
                lpId: numericLpId,
                content: commentContent,
            },
            {
                onSuccess: () => {
                    setCommentContent('');
                },
                onError: (error) => {
                    console.error('댓글 생성 실패:', error);
                    alert('댓글 생성에 실패했습니다.');
                },
            }
        );
    };

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

    const isMyLp = myInfo?.id === data.authorId;

    const handleDelete = () => {
        if (!numericLpId) return;

        if (!window.confirm('정말 이 LP를 삭제하시겠습니까?')) {
            return;
        }

        deleteLpMutation.mutate(numericLpId, {
            onSuccess: () => {
                navigate('/');
                alert('LP가 삭제되었습니다.');
            },
            onError: (error) => {
                console.error('LP 삭제 실패:', error);
                alert('LP 삭제에 실패했습니다.');
            },
        });
    };

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
                            {isMyLp && (
                                <>
                                    <button
                                        type='button'
                                        onClick={() => setIsEditModalOpen(true)}
                                        className='inline-flex items-center gap-1 rounded-full border border-gray-600 px-3 py-1 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300'
                                    >
                                        <span>✏️</span>
                                        수정
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setIsDeleteModalOpen(true)
                                        }
                                        disabled={deleteLpMutation.isPending}
                                        className='inline-flex items-center gap-1 rounded-full border border-red-400 px-3 py-1 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <span>🗑️</span>
                                        {deleteLpMutation.isPending
                                            ? '삭제 중...'
                                            : '삭제'}
                                    </button>
                                </>
                            )}
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

            <section className='mt-12 rounded-3xl bg-[#1a1a20] px-6 py-8 shadow-2xl sm:px-8'>
                <header className='flex flex-wrap items-center justify-between gap-3'>
                    <h2 className='text-xl font-semibold text-white'>
                        댓글
                    </h2>
                    <span className='text-sm text-gray-400'>
                        총 {comments.length}개
                    </span>
                </header>

                <form
                    onSubmit={handleCommentSubmit}
                    className='mt-6 flex flex-col gap-3 rounded-2xl border border-gray-700 bg-gray-900/60 p-4'
                >
                    <textarea
                        value={commentContent}
                        onChange={(event) =>
                            setCommentContent(
                                event.target.value
                            )
                        }
                        placeholder='댓글을 입력해주세요'
                        maxLength={300}
                        className='min-h-[96px] w-full resize-y rounded-xl border border-gray-700 bg-[#1f1f25] px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40'
                    />
                    <div className='flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400'>
                        <span
                            className={
                                isCommentValid
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                            }
                        >
                            {commentHelperText}
                        </span>
                        <span>
                            {commentContent.trim().length} /
                            300
                        </span>
                    </div>
                    <div className='flex items-center justify-end gap-2'>
                        <button
                            type='button'
                            onClick={() =>
                                setCommentContent('')
                            }
                            className='rounded-full border border-gray-700 px-4 py-2 text-xs font-medium text-gray-300 transition hover:border-gray-500 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600'
                        >
                            취소
                        </button>
                        <button
                            type='submit'
                            disabled={!isCommentValid}
                            className='rounded-full border border-blue-500 px-5 py-2 text-xs font-semibold text-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500'
                        >
                            댓글 등록
                        </button>
                    </div>
                </form>

                <div className='mt-6 flex items-center justify-end gap-2 text-xs'>
                    <button
                        type='button'
                        onClick={() =>
                            handleChangeCommentOrder('asc')
                        }
                        className={`rounded-full border px-3 py-1 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            commentOrder === 'asc'
                                ? 'border-blue-500 bg-blue-500/20 text-blue-200'
                                : 'border-gray-600 bg-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                        }`}
                    >
                        오래된순
                    </button>
                    <button
                        type='button'
                        onClick={() =>
                            handleChangeCommentOrder('desc')
                        }
                        className={`rounded-full border px-3 py-1 font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                            commentOrder === 'desc'
                                ? 'border-blue-500 bg-blue-500/20 text-blue-200'
                                : 'border-gray-600 bg-transparent text-gray-400 hover:border-gray-500 hover:text-gray-200'
                        }`}
                    >
                        최신순
                    </button>
                </div>

                <div className='mt-6 space-y-4'>
                    {isCommentsSkeletonVisible &&
                        Array.from({
                            length: COMMENT_SKELETON_BASE_COUNT,
                        }).map((_, index) => (
                            <SkeletonCard
                                key={`comment-skeleton-${index}`}
                                variant='comment'
                            />
                        ))}

                    {!isCommentsSkeletonVisible &&
                        comments.map((comment) => (
                            <LpCommentItem
                                key={comment.id}
                                comment={comment}
                            />
                        ))}

                    {!isCommentsSkeletonVisible &&
                        comments.length === 0 &&
                        !areCommentsFetching && (
                            <div className='rounded-2xl border border-dashed border-gray-700 bg-gray-800/40 px-4 py-10 text-center text-sm text-gray-400'>
                                아직 댓글이 없습니다.
                            </div>
                        )}

                    {isFetchingNextComments &&
                        Array.from({ length: 2 }).map(
                            (_, index) => (
                                <SkeletonCard
                                    key={`comment-next-skeleton-${index}`}
                                    variant='comment'
                                />
                            )
                        )}
                </div>

                <div
                    ref={commentsRef}
                    className='h-1 w-full'
                />

                {hasNextComments && (
                    <div className='py-4 text-center text-xs text-gray-500'>
                        {isFetchingNextComments
                            ? '댓글을 불러오는 중...'
                            : '아래로 스크롤하면 더 가져옵니다'}
                    </div>
                )}

                {isCommentsError && (
                    <div className='mt-4 text-center text-xs text-red-400'>
                        댓글을 불러오지 못했습니다.
                    </div>
                )}
            </section>

            {/* 수정 모달 */}
            {isEditModalOpen && (
                <EditLpModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    lp={{
                        id: data.id,
                        title: data.title,
                        content: data.content,
                        thumbnail: data.thumbnail,
                        published: data.published,
                        authorId: data.authorId,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        tags: data.tags,
                        likes: data.likes,
                    }}
                />
            )}

            {/* 삭제 확인 모달 */}
            {isDeleteModalOpen && (
                <>
                    <div
                        className='fixed inset-0 z-50 bg-black/50'
                        onClick={() => setIsDeleteModalOpen(false)}
                        aria-hidden
                    />
                    <div className='fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-gray-800 p-6 shadow-xl'>
                        <h2 className='mb-4 text-xl font-semibold text-white'>
                            정말 삭제하시겠습니까?
                        </h2>
                        <p className='mb-6 text-sm text-gray-300'>
                            삭제하시면 복구할 수 없습니다. 정말
                            삭제하시겠습니까?
                        </p>
                        <div className='flex justify-end gap-3'>
                            <button
                                type='button'
                                onClick={() =>
                                    setIsDeleteModalOpen(false)
                                }
                                className='rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500'
                            >
                                취소
                            </button>
                            <button
                                type='button'
                                onClick={handleDelete}
                                disabled={deleteLpMutation.isPending}
                                className='rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {deleteLpMutation.isPending
                                    ? '삭제 중...'
                                    : '삭제하기'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LpDetailPage;
