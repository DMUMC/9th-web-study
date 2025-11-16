import { FiHeart } from "react-icons/fi"
import type { LpDetailData } from "../types/lp"

interface LpDetailContentProps {
  lpDetail: LpDetailData
  currentUserId: number | null
  isLiked: boolean
  onEdit: () => void
  onDelete: () => void
  onLike: () => void
}

export const LpDetailContent = ({
  lpDetail,
  currentUserId,
  isLiked,
  onEdit,
  onDelete,
  onLike,
}: LpDetailContentProps) => {
  const isMyLp = currentUserId !== null && lpDetail.authorId === currentUserId

  return (
    <>
      <header className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-white">{lpDetail.title}</h1>
        <div className="flex flex-col gap-2 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
          <span>
            업로드일:{" "}
            {new Intl.DateTimeFormat("ko-KR", {
              dateStyle: "medium",
            }).format(new Date(lpDetail.createdAt))}
          </span>
          <span>작성자: {lpDetail.author.name}</span>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-[#202020]">
          <img
            src={lpDetail.thumbnail}
            alt={lpDetail.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-4 rounded-lg bg-[#202020] p-4">
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-200">
            {lpDetail.content || "내용이 없습니다."}
          </p>
          <div className="flex flex-wrap gap-2">
            {lpDetail.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-[#1f1f1f] px-3 py-1 text-xs text-gray-200"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onLike}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-inner transition-colors ${
            isLiked
              ? "bg-[#ff00b3] text-white hover:bg-[#b3007d]"
              : "bg-[#202020] text-white hover:bg-[#2d2d2d]"
          }`}
        >
          <FiHeart size={18} fill={isLiked ? "currentColor" : "none"} />
          {lpDetail.likes.length}
        </button>
        {isMyLp && (
          <>
            <button
              type="button"
              onClick={onEdit}
              className="rounded-md bg-[#ff00b3] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#b3007d]"
            >
              수정
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              삭제
            </button>
          </>
        )}
      </section>
    </>
  )
}
