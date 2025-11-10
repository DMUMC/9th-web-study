import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getLpDetail } from "../apis/lp"
import { LpErrorState, LpLoadingNotice, LpSkeletonGrid } from "../components/LpFallbacks"

export const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>()
  const parsedId = Number(lpid)
  const isValidLpId = Number.isInteger(parsedId) && parsedId > 0

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["lp", parsedId],
    queryFn: () => getLpDetail(parsedId),
    enabled: isValidLpId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  })

  const lpDetail = useMemo(() => data?.data, [data])

  if (!isValidLpId) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 text-white">
        <LpErrorState
          message="유효하지 않은 LP 식별자입니다."
          onRetry={() => {
            void refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 text-white">
      {isFetching && !isLoading && (
        <LpLoadingNotice text="LP 정보를 새로고치는 중입니다…" />
      )}

      {isLoading ? (
        <LpSkeletonGrid count={1} columnsClassName="grid-cols-1" />
      ) : isError || !lpDetail ? (
        <LpErrorState
          message="LP 상세 정보를 불러오는데 실패했습니다."
          onRetry={() => refetch()}
        />
      ) : (
        <article className="flex flex-col gap-8">
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

          <footer className="flex flex-wrap gap-3">
            <div className="flex flex-1 items-center justify-center rounded-md bg-[#202020] px-4 py-2 text-sm font-semibold text-white shadow-inner">
              <span className="flex items-center gap-2 text-base">
                <span role="img" aria-label="heart">
                  ❤️
                </span>
                {lpDetail.likes.length}
              </span>
            </div>
            <button
              type="button"
              className="rounded-md bg-[#202020] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#2d2d2d]"
            >
              수정
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold transition-colors hover:bg-red-700"
            >
              삭제
            </button>
          </footer>
        </article>
      )}
    </div>
  )
}
