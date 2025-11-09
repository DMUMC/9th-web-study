import type { CommentDto } from '../types/comment';
import { formatRelativeTime } from '../utils/date';

type CommentCardProps = {
  comment: CommentDto;
};

export const CommentCard = ({ comment }: CommentCardProps) => {
  const initial = comment.author?.name?.[0]?.toUpperCase() ?? 'U';
  const relativeTime = formatRelativeTime(comment.createdAt);

  return (
    <article className="flex items-start gap-3 rounded-2xl bg-transparent px-1 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ff2b9c] to-[#ff6b81] text-sm font-semibold text-white">
        {initial}
      </div>
      <div className="flex-1 border-b border-white/5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{comment.author?.name ?? '익명 사용자'}</p>
            <p className="text-xs text-neutral-500">{relativeTime}</p>
          </div>
          <button
            type="button"
            className="rounded-full p-1 text-neutral-500 transition-colors hover:text-white"
            aria-label="댓글 옵션"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="5" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="19" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral-200">{comment.content}</p>
      </div>
    </article>
  );
};
