import { useState } from "react"
import type { Dispatch, MutableRefObject, SetStateAction } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LpErrorState } from "./LpFallbacks"
import { CommentItem } from "./CommentItem"
import { SortButtons } from "./SortButtons"
import { createComment, updateComment, deleteComment } from "../apis/lp"
import type { LpCommentItem, LpOrder } from "../types/lp"

interface LpCommentsSectionProps {
  lpId: number
  currentUserId: number | null
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
  lpId,
  currentUserId,
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
  const [commentContent, setCommentContent] = useState("")
  const [editingComment, setEditingComment] = useState<LpCommentItem | null>(null)
  const [editContent, setEditContent] = useState("")
  const queryClient = useQueryClient()

  // 댓글 작성
  const createCommentMutation = useMutation({
    mutationFn: (content: string) => createComment(lpId, { content }),
    onSuccess: () => {
      setCommentContent("")
      void queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] })
    },
    onError: (error) => {
      console.error("댓글 작성 실패:", error)
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.")
    },
  })

  // 댓글 수정
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment(lpId, commentId, { content }),
    onSuccess: () => {
      setEditingComment(null)
      setEditContent("")
      void queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] })
    },
    onError: (error) => {
      console.error("댓글 수정 실패:", error)
      alert("댓글 수정에 실패했습니다. 다시 시도해주세요.")
    },
  })

  // 댓글 삭제
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] })
    },
    onError: (error) => {
      console.error("댓글 삭제 실패:", error)
      alert("댓글 삭제에 실패했습니다. 다시 시도해주세요.")
    },
  })

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedContent = commentContent.trim()
    if (!trimmedContent) {
      alert("댓글 내용을 입력해주세요.")
      return
    }
    if (trimmedContent.length > 500) {
      alert("댓글은 최대 500자까지 입력할 수 있습니다.")
      return
    }
    createCommentMutation.mutate(trimmedContent)
  }

  const handleStartEdit = (comment: LpCommentItem) => {
    setEditingComment(comment)
    setEditContent(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent("")
  }

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingComment) return

    const trimmedContent = editContent.trim()
    if (!trimmedContent) {
      alert("댓글 내용을 입력해주세요.")
      return
    }
    if (trimmedContent.length > 500) {
      alert("댓글은 최대 500자까지 입력할 수 있습니다.")
      return
    }
    updateCommentMutation.mutate({
      commentId: editingComment.id,
      content: trimmedContent,
    })
  }

  const handleDelete = (commentId: number) => {
    if (confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation.mutate(commentId)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">댓글</h2>
        <SortButtons order={commentOrder} onChangeOrder={onChangeOrder} />
      </header>

      <form onSubmit={handleSubmitComment} className="flex flex-col gap-3 rounded-lg bg-[#202020] p-4">
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="h-24 w-full resize-none rounded-lg border border-dashed border-gray-600 bg-transparent p-3 text-sm text-gray-300 outline-none focus:border-[#ff00b3]"
          placeholder="댓글을 입력해 주세요."
          maxLength={500}
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            최대 500자까지 입력할 수 있어요. ({commentContent.length}/500)
          </span>
          <button
            type="submit"
            disabled={createCommentMutation.isPending || !commentContent.trim()}
            className="rounded-md bg-[#ff00b3] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b3007d] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createCommentMutation.isPending ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>

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
          {comments.map((comment) => {
            const isEditing = editingComment?.id === comment.id
            if (isEditing) {
              return (
                <form
                  key={comment.id}
                  onSubmit={handleSubmitEdit}
                  className="flex flex-col gap-3 rounded-lg bg-[#202020] p-4"
                >
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="h-24 w-full resize-none rounded-lg border border-gray-600 bg-[#1a1a1a] p-3 text-sm text-white outline-none focus:border-[#ff00b3] focus:ring-1 focus:ring-[#ff00b3]"
                    placeholder="댓글을 입력해 주세요."
                    maxLength={500}
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      최대 500자까지 입력할 수 있어요. ({editContent.length}/500)
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded-md border border-gray-600 bg-transparent px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-[#2a2a2a]"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        disabled={updateCommentMutation.isPending || !editContent.trim()}
                        className="rounded-md bg-[#ff00b3] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b3007d] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updateCommentMutation.isPending ? "수정 중..." : "수정"}
                      </button>
                    </div>
                  </div>
                </form>
              )
            }
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                onEdit={handleStartEdit}
                onDelete={handleDelete}
              />
            )
          })}
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
