import { useState, useRef, useEffect } from "react"
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi"
import type { LpCommentItem } from "../types/lp"

interface CommentItemProps {
  comment: LpCommentItem
  currentUserId: number | null
  onEdit: (comment: LpCommentItem) => void
  onDelete: (commentId: number) => void
}

export const CommentItem = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
}: CommentItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const isMyComment = currentUserId !== null && comment.authorId === currentUserId

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isMenuOpen])

  return (
    <article className="rounded-lg bg-[#202020] p-4 text-sm">
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
        {isMyComment && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
              aria-label="댓글 메뉴"
            >
              <FiMoreVertical size={18} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 flex flex-col rounded-lg border border-gray-700 bg-[#1a1a1a] shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    onEdit(comment)
                    setIsMenuOpen(false)
                  }}
                  className="flex w-20 items-center justify-center gap-2 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-[#2a2a2a]"
                >
                  <FiEdit2 size={14} />
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(comment.id)
                    setIsMenuOpen(false)
                  }}
                  className="flex w-20 items-center justify-center gap-2 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-[#2a2a2a]"
                >
                  <FiTrash2 size={14} />
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="mt-3 whitespace-pre-line text-gray-200">{comment.content}</p>
    </article>
  )
}

