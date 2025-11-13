import type { Dispatch, MutableRefObject, SetStateAction } from "react"
import { LpErrorState } from "./LpFallbacks"
import type { LpCommentItem, LpOrder } from "../types/lp"

interface LpCommentsSectionProps {
  commentOrder: LpOrder
  onChangeOrder: Dispatch<SetStateAction<LpOrder>>
  isCommentsLoading: boolean
  isCommentsError: boolean
  comments: LpCommentItem[]
  onRetry: () => void
  commentsSentinelRef: MutableRefObject<HTMLDivElement | null>
  isFetchingNextPage: boolean
  hasNextPage: boolean | undefined
}

const CommentSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`comment-skeleton-${index}`} className="rounded-lg bg-[#202020] p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full">
              <div className="lp-skeleton-shimmer" />
            </div>
            <div className="flex-1 space-y-2">
              <span className="lp-skeleton-bar block h-3 w-24" />
              <span className="lp-skeleton-bar block h-3 w-16" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <span className="lp-skeleton-bar block h-3 w-full" />
            <span className="lp-skeleton-bar block h-3 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}

export const LpCommentsSection = ({
  commentOrder,
  onChangeOrder,
  isCommentsLoading,
  isCommentsError,
  comments,
  onRetry,
  commentsSentinelRef,
  isFetchingNextPage,
  hasNextPage,
}: LpCommentsSectionProps) => {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">댓글</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChangeOrder("asc")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              commentOrder === "asc"
                ? "bg-[#ff00b3] text-white"
                : "bg-[#1f1f1f] text-gray-300 hover:bg-[#2d2d2d]"
            }`}
          >
            오래된순
          </button>
          <button
            type="button"
            onClick={() => onChangeOrder("desc")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              commentOrder === "desc"
                ? "bg-[#ff00b3] text-white"
                : "bg-[#1f1f1f] text-gray-300 hover:bg-[#2d2d2d]"
            }`}
          >
            최신순
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-3 rounded-lg bg-[#202020] p-4">
        <textarea
          className="h-24 w-full resize-none rounded-lg border border-dashed border-gray-600 bg-transparent p-3 text-sm text-gray-300 outline-none"
          placeholder="댓글을 입력해 주세요."
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>최대 500자까지 입력할 수 있어요.</span>
          <button
            type="button"
            className="rounded-md bg-[#ff00b3]/40 px-4 py-2 text-sm font-semibold text-white/60"
          >
            등록
          </button>
        </div>
      </div>

      {isCommentsLoading ? (
        <CommentSkeleton />
      ) : isCommentsError ? (
        <LpErrorState message="댓글을 불러오는데 실패했습니다." onRetry={onRetry} />
      ) : comments.length === 0 ? (
        <div className="rounded-lg bg-[#202020] p-6 text-center text-sm text-gray-400">
          아직 댓글이 없어요.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-lg bg-[#202020] p-4 text-sm">
              <div className="flex items-center gap-3">
                {comment.author.avatar ? (
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff00b3]/30 text-base font-semibold text-[#ffb0e5]">
                    {comment.author.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-semibold text-gray-200">{comment.author.name}</span>
                    <time>
                      {new Intl.DateTimeFormat("ko-KR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(comment.createdAt))}
                    </time>
                  </div>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-gray-200">{comment.content}</p>
            </article>
          ))}
          <div ref={commentsSentinelRef} className="h-4 w-full" />
          {isFetchingNextPage && <CommentSkeleton count={2} />}
          {!hasNextPage && comments.length > 0 && (
            <div className="py-4 text-center text-xs text-gray-500">
              더 이상 불러올 댓글이 없습니다.
            </div>
          )}
        </div>
      )}
    </section>
  )
}
