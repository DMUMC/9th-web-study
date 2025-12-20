import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CommentDto } from '../types/comment';
import { formatRelativeTime } from '../utils/date';
import { deleteLpComment, patchLpComment } from '../apis/comments';

type CommentCardProps = {
  comment: CommentDto;
  lpId: number;
  currentUserId?: number;
};

export const CommentCard = ({ comment, lpId, currentUserId }: CommentCardProps) => {
  const initial = comment.author?.name?.[0]?.toUpperCase() ?? 'U';
  const relativeTime = formatRelativeTime(comment.createdAt);
  const isMine = currentUserId === comment.authorId;
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDraft(comment.content);
  }, [comment.content]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
  };

  const { mutate: updateComment, isPending: isUpdating } = useMutation({
    mutationFn: (content: string) => patchLpComment({ lpId, commentId: comment.id, content }),
    onSuccess: () => {
      setIsEditing(false);
      invalidateComments();
    },
    onError: () => {
      alert('댓글 수정에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const { mutate: removeComment, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteLpComment({ lpId, commentId: comment.id }),
    onSuccess: () => {
      invalidateComments();
    },
    onError: () => {
      alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleDelete = () => {
    if (isDeleting) return;
    if (window.confirm('댓글을 삭제할까요?')) {
      removeComment();
    }
  };

  const handleSubmitEdit = () => {
    const next = draft.trim();
    if (!next || next === comment.content || isUpdating) return;
    updateComment(next);
  };

  return (
    <article className="flex items-start gap-3 rounded-2xl bg-transparent px-1 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ff2b9c] to-[#ff6b81] text-sm font-semibold text-white">
        {initial}
      </div>
      <div className="flex-1 border-b border-white/5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{comment.author?.name ?? '익명 사용자'}</p>
            <p className="text-xs text-neutral-500">{relativeTime}</p>
          </div>
          {isMine && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-full p-1 text-neutral-500 transition-colors hover:text-white"
                aria-label="댓글 옵션"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="19" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </button>
              {menuOpen && !isEditing && (
                <div className="absolute right-0 mt-2 w-32 rounded-2xl border border-neutral-800 bg-[#15161c] py-1 text-sm text-white shadow-xl">
                  <button
                    type="button"
                    className="flex w-full items-center px-4 py-2 text-left hover:bg-white/5"
                    onClick={() => {
                      setIsEditing(true);
                      setMenuOpen(false);
                      setDraft(comment.content);
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center px-4 py-2 text-left text-[#ff6b81] hover:bg-[#ff6b81]/10"
                    onClick={() => {
                      setMenuOpen(false);
                      handleDelete();
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-3 space-y-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              className="w-full resize-none rounded-2xl border border-neutral-700 bg-transparent px-4 py-3 text-sm text-white focus:border-[#ff2b9c] focus:outline-none"
            />
            <div className="flex justify-end gap-2 text-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setDraft(comment.content);
                }}
                className="rounded-2xl border border-neutral-700 px-4 py-2 text-neutral-300 hover:border-neutral-500"
                disabled={isUpdating}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmitEdit}
                disabled={!draft.trim() || draft.trim() === comment.content || isUpdating}
                className="rounded-2xl bg-[#ff2b9c] px-4 py-2 text-white transition-colors hover:bg-[#ff4cad] disabled:cursor-not-allowed disabled:bg-neutral-700"
              >
                {isUpdating ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-neutral-200">{comment.content}</p>
        )}
      </div>
    </article>
  );
};
