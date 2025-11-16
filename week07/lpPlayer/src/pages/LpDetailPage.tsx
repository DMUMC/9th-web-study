import { useEffect, useMemo, useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useLpDetailQuery } from '../hooks/queries/useLpDetailQuery';
import { useLpCommentsQuery } from '../hooks/queries/useLpCommentsQuery';
import { useMyInfoQuery } from '../hooks/queries/useMyInfoQuery';
import { useAuth } from '../useAuth';
import { StateMessage } from '../components/StateMessage';
import { Modal } from '../components/Modal';
import { formatRelativeTime } from '../utils/date';
import { CommentCard } from '../components/CommentCard';
import { CommentSkeleton } from '../components/CommentSkeleton';
import { postLpComment } from '../apis/comments';
import { deleteLp, likeLp, unlikeLp } from '../apis/lps';
import { LpCreateModal } from '../components/LpCreateModal';

export const LpDetailPage = () => {
  const { lpId } = useParams();
  const numericId = Number(lpId);
  const resolvedLpId = Number.isFinite(numericId) ? numericId : null;
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [showGuard, setShowGuard] = useState(!isLoggedIn);
  const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');
  const [commentContent, setCommentContent] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: myInfo } = useMyInfoQuery();

  useEffect(() => {
    setShowGuard(!isLoggedIn);
  }, [isLoggedIn]);

  const { data, isLoading, isError, refetch } = useLpDetailQuery(resolvedLpId);

  const lp = useMemo(() => data?.data, [data]);
  const likesCount = lp?.likes?.length ?? 0;
  const relativeTime = lp ? formatRelativeTime(lp.createdAt) : '';
  const avatarInitial = lp?.author?.name?.[0] ?? 'U';
  const isOwner = useMemo(() => {
    if (!lp || !myInfo) return false;
    return lp.authorId === myInfo.id;
  }, [lp, myInfo]);
  const isLiked = useMemo(() => {
    if (!lp || !myInfo) return false;
    return lp.likes?.some((like) => like.userId === myInfo.id) ?? false;
  }, [lp, myInfo]);

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: isFetchingNextComments,
  } = useLpCommentsQuery(resolvedLpId, commentOrder);

  const comments = useMemo(
    () => commentsData?.pages.flatMap((page) => page.data?.data ?? []) ?? [],
    [commentsData],
  );

  const commentLoadMoreRef = useRef<HTMLDivElement | null>(null);

  const invalidateCommentQueries = () => {
    if (!resolvedLpId) return;
    queryClient.invalidateQueries({ queryKey: ['lpComments', resolvedLpId] });
  };

  const { mutate: createComment, isPending: isCreatingComment } = useMutation({
    mutationFn: (content: string) => {
      if (!resolvedLpId) throw new Error('LP 정보가 없습니다.');
      return postLpComment({ lpId: resolvedLpId, content });
    },
    onSuccess: () => {
      setCommentContent('');
      invalidateCommentQueries();
    },
    onError: () => {
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { mutate: deleteLpMutation, isPending: isDeletingLp } = useMutation({
    mutationFn: () => {
      if (!resolvedLpId) throw new Error('LP 정보가 없습니다.');
      return deleteLp(resolvedLpId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      navigate('/');
    },
    onError: () => {
      alert('LP 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { mutate: toggleLike, isPending: isTogglingLike } = useMutation({
    mutationFn: (liked: boolean) => {
      if (!resolvedLpId) throw new Error('LP 정보가 없습니다.');
      return liked ? unlikeLp(resolvedLpId) : likeLp(resolvedLpId);
    },
    onSuccess: () => {
      if (resolvedLpId) {
        queryClient.invalidateQueries({ queryKey: ['lp', resolvedLpId] });
        queryClient.invalidateQueries({ queryKey: ['lps'] });
      }
    },
    onError: () => {
      alert('좋아요 처리 중 오류가 발생했습니다.');
    },
  });

  useEffect(() => {
    if (!commentLoadMoreRef.current || !hasMoreComments) return undefined;
    const node = commentLoadMoreRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreComments && !isFetchingNextComments) {
          fetchNextComments();
        }
      },
      { threshold: 1 },
    );
    observer.observe(node);
    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [fetchNextComments, hasMoreComments, isFetchingNextComments]);

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: location } });
  };

  const handleBack = () => navigate(-1);

  const handleEditOpen = () => {
    if (!isOwner) return;
    setEditModalOpen(true);
  };

  const handleDelete = () => {
    if (!isOwner || !resolvedLpId || isDeletingLp) return;
    const confirmed = window.confirm('이 LP를 삭제할까요? 되돌릴 수 없습니다.');
    if (!confirmed) return;
    deleteLpMutation();
  };

  const handleLike = () => {
    if (!resolvedLpId || isTogglingLike) return;
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }
    toggleLike(isLiked);
  };

  const handleCommentSubmit = () => {
    if (!resolvedLpId || isCreatingComment) return;
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }
    const value = commentContent.trim();
    if (!value) return;
    createComment(value);
  };

  const commentPlaceholder = isLoggedIn ? '댓글을 입력해주세요' : '댓글 작성은 로그인 후 이용 가능합니다.';
  const canSubmitComment = Boolean(commentContent.trim()) && isLoggedIn && !isCreatingComment;

  if (!Number.isFinite(numericId)) {
    return (
      <StateMessage
        title="잘못된 LP 주소입니다"
        description="URL을 다시 확인한 뒤 시도해주세요."
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <button
        type="button"
        onClick={handleBack}
        className="text-left text-sm text-neutral-400 transition-colors hover:text-white"
      >
        ← 목록으로 돌아가기
      </button>

      {isLoading ? (
        <div className="space-y-6 rounded-[32px] border border-neutral-900 bg-neutral-950/50 p-8">
          <div className="h-8 w-2/3 animate-pulse rounded-full bg-neutral-800" />
          <div className="h-5 w-1/2 animate-pulse rounded-full bg-neutral-800" />
          <div className="h-64 w-full animate-pulse rounded-[24px] bg-neutral-800" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-4 w-full animate-pulse rounded-full bg-neutral-800" />
            ))}
          </div>
        </div>
      ) : isError || !lp ? (
        <StateMessage
          title="LP 상세 정보를 불러오지 못했습니다"
          description="페이지를 새로고침하거나 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={refetch}
        />
      ) : (
        <div className="space-y-8">
          <section className="space-y-6 rounded-[32px] border border-neutral-900 bg-[#111218] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                  {avatarInitial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{lp.author?.name ?? '익명'}</p>
                  <p className="text-xs text-neutral-500">{relativeTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-500">
                <button
                  type="button"
                  className="rounded-full border border-transparent p-2 transition-colors hover:border-neutral-700 hover:text-white"
                  aria-label="편집"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path
                      d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="rounded-full border border-transparent p-2 transition-colors hover:border-neutral-700 hover:text-white"
                  aria-label="삭제"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M6 7h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path
                      d="M8 7v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-600">featured lp</p>
              <h1 className="text-4xl font-black text-white">{lp.title}</h1>
            </div>

            <div
              className="overflow-hidden rounded-[28px] border border-neutral-900 bg-black/30"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img src={lp.thumbnail} alt={lp.title} className="h-full w-full object-cover" />
            </div>

            <p className="text-base leading-relaxed text-neutral-200 whitespace-pre-line">{lp.content}</p>

            <div className="flex flex-wrap gap-2">
              {lp.tags?.length ? (
                lp.tags.map((tag) => (
                  <span key={tag.id} className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white">
                    #{tag.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-500">태그 없음</span>
              )}
            </div>

            <div className="flex items-center justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-[#ff2b9c] px-6 py-2 text-sm font-semibold text-white shadow-[0_20px_35px_rgba(255,43,156,0.45)] transition-transform hover:scale-105"
              >
                <span>❤</span>
                좋아요 {likesCount}
              </button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={handleEditOpen}
                  className="rounded-2xl border border-neutral-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-neutral-500"
                >
                  수정하기
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeletingLp}
                  className="rounded-2xl border border-neutral-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-neutral-500 disabled:cursor-not-allowed disabled:border-neutral-900"
                >
                  {isDeletingLp ? '삭제 중...' : '삭제하기'}
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleLike}
              disabled={isTogglingLike}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
                isLiked
                  ? 'border-transparent bg-[#ff6b81] text-white hover:bg-[#ff8396]'
                  : 'border-transparent bg-[#ff2b9c] text-white hover:bg-[#ff4cad]'
              } disabled:cursor-not-allowed disabled:bg-neutral-700`}
            >
              {isTogglingLike
                ? '처리 중...'
                : `${isLiked ? '좋아요 취소' : '좋아요'} (${likesCount})`}
            </button>
          </section>

          <section className="space-y-6 rounded-[32px] border border-neutral-900 bg-[#181920] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">댓글</h2>
              <div className="inline-flex items-center rounded-full bg-white/5 p-1 text-sm font-semibold">
                {[
                  { value: 'asc', label: '오래된순' },
                  { value: 'desc', label: '최신순' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCommentOrder(option.value as 'asc' | 'desc')}
                    className={`rounded-full px-4 py-1.5 transition-all ${
                      commentOrder === option.value ? 'bg-white text-black shadow-sm' : 'text-neutral-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-neutral-800 bg-[#1f2026] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <textarea
                  value={commentContent}
                  onChange={(event) => setCommentContent(event.target.value)}
                  className="h-20 flex-1 resize-none rounded-2xl border border-neutral-700 bg-transparent px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#ff2b9c] focus:outline-none disabled:opacity-50"
                  placeholder={commentPlaceholder}
                  disabled={!isLoggedIn || isCreatingComment}
                />
                <button
                  type="button"
                  onClick={handleCommentSubmit}
                  className="rounded-2xl bg-[#ff2b9c] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff4cad] disabled:cursor-not-allowed disabled:bg-neutral-800"
                  disabled={!canSubmitComment}
                >
                  {isCreatingComment ? '작성 중...' : '작성'}
                </button>
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                {isLoggedIn ? 'LP에 대한 생각을 자유롭게 남겨보세요.' : '댓글 작성은 로그인 후 이용하실 수 있습니다.'}
              </p>
            </div>

            {isCommentsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <CommentSkeleton key={idx} />
                ))}
              </div>
            ) : isCommentsError ? (
              <StateMessage
                title="댓글을 불러오지 못했습니다"
                description="잠시 후 다시 시도해주세요."
                actionLabel="다시 시도"
                onAction={refetchComments}
              />
            ) : comments.length === 0 ? (
              <StateMessage title="등록된 댓글이 없어요" description="LP에 대한 생각을 가장 먼저 남겨보세요." />
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} lpId={numericId} currentUserId={myInfo?.id} />
                ))}
              </div>
            )}

            {isFetchingNextComments && (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <CommentSkeleton key={`comment-next-${idx}`} />
                ))}
              </div>
            )}

            <div ref={commentLoadMoreRef} className="h-8 w-full" />
          </section>
        </div>
      )}

      {showGuard && (
        <Modal
          title="로그인이 필요합니다"
          description="상세 정보를 확인하려면 먼저 로그인해주세요."
          confirmLabel="로그인 하러가기"
          onConfirm={handleLoginRedirect}
        />
      )}
      {isOwner && lp && resolvedLpId && (
        <LpCreateModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          mode="edit"
          initialData={{
            id: resolvedLpId,
            title: lp.title,
            content: lp.content,
            tags: lp.tags?.map((tag) => tag.name) ?? [],
            thumbnail: lp.thumbnail ?? null,
            published: lp.published ?? true,
          }}
          onCompleted={() => {
            if (resolvedLpId) {
              queryClient.invalidateQueries({ queryKey: ['lp', resolvedLpId] });
            }
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
