interface LpSkeletonGridProps {
  count?: number
  columnsClassName?: string
}

export const LpSkeletonGrid = ({ count = 10, columnsClassName }: LpSkeletonGridProps) => {
  const items = Array.from({ length: count })

  return (
    <div className={`grid gap-4 ${columnsClassName ?? "grid-cols-3 md:grid-cols-4 xl:grid-cols-5"}`}>
      {items.map((_, index) => (
        <div
          key={`lp-skeleton-${index}`}
          className="relative overflow-hidden rounded-lg bg-[#202020]"
        >
          <div className="aspect-square">
            <div className="lp-skeleton-shimmer" />
          </div>
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
            <span className="lp-skeleton-bar h-4 w-3/4" />
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="lp-skeleton-bar h-3 w-20" />
              <span className="lp-skeleton-bar h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface LpErrorStateProps {
  message?: string
  onRetry: () => void
}

export const LpErrorState = ({ message = "LP 정보를 불러오는데 실패했습니다.", onRetry }: LpErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-[#202020] p-8 text-center text-white">
      <div className="text-base font-semibold text-red-400">{message}</div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-gray-200"
      >
        다시 시도
      </button>
    </div>
  )
}

interface LpLoadingNoticeProps {
  text?: string
}

export const LpLoadingNotice = ({ text = "목록을 새로고치는 중입니다…" }: LpLoadingNoticeProps) => {
  return <div className="text-sm text-gray-400">{text}</div>
}
