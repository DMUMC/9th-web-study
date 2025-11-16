import { useEffect, useMemo, useRef, useState } from "react"
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { InfiniteData } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createLp, getLpList } from "../apis/lp"
import { LpErrorState, LpLoadingNotice, LpSkeletonGrid } from "../components/LpFallbacks"
import { CreateLpModal } from "../components/CreateLpModal"
import type { LpOrder, ResponseLpListDto } from "../types/lp"

export const HomePage = () => {
  const [sort, setSort] = useState<LpOrder>("desc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ResponseLpListDto, Error, ResponseLpListDto, [string, LpOrder], number>({
    queryKey: ["lps", sort],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getLpList({
        order: sort,
        limit: 10,
        cursor: pageParam ?? 0,
      }),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    getNextPageParam: (lastPage) => {
      const { hasNext, nextCursor } = lastPage.data
      if (!hasNext || nextCursor == null) {
        return undefined
      }
      return nextCursor
    },
  })

  const toggleSort = () => {
    setSort((prev) => (prev === "desc" ? "asc" : "desc"))
  }

  const createLpMutation = useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      // LP 목록 새로고침
      void queryClient.invalidateQueries({ queryKey: ["lps"] })
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.error("LP 작성 실패:", error)
      alert("LP 작성에 실패했습니다. 다시 시도해주세요.")
    },
  })

  const handleCreateLp = (data: {
    title: string
    content: string
    thumbnail: string | null
    tags: string[]
  }) => {
    createLpMutation.mutate(data)
  }

  const infiniteData = data as InfiniteData<ResponseLpListDto, number> | undefined

  const lpList = useMemo(() => {
    if (!infiniteData) return []
    return infiniteData.pages.flatMap((page) => page.data.data)
  }, [infiniteData])

  useEffect(() => {
    const target = sentinelRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      {
        rootMargin: "200px",
      }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, sort])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 text-white">
      <header className="flex justify-end">
        <button
          type="button"
          onClick={toggleSort}
          className="rounded-md bg-[#ff00b3] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#b3007d]"
        >
          정렬: {sort === "desc" ? "최신순" : "오래된순"}
        </button>
      </header>

      {isFetching && !isLoading && <LpLoadingNotice />}

      {isLoading ? (
        <LpSkeletonGrid />
      ) : isError ? (
        <LpErrorState onRetry={() => refetch()} message="LP 목록을 불러오는데 실패했습니다." />
      ) : (
        <>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-4 xl:grid-cols-5">
          {lpList.map((lp) => {
            return (
              <div
                key={lp.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/lp/${lp.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    navigate(`/lp/${lp.id}`)
                  }
                }}
                className="group relative cursor-pointer overflow-hidden rounded-lg bg-[#202020] transition-transform duration-300 ease-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#ff00b3] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h2 className="text-sm font-semibold text-white">
                    {lp.title}
                  </h2>
                  <div className="mt-1 flex items-center justify-between text-xs text-gray-300">
                    <span>
                      {new Intl.DateTimeFormat("ko-KR", {
                        dateStyle: "medium",
                      }).format(new Date(lp.createdAt))}
                    </span>
                    <span>좋아요 {lp.likes.length}개</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div ref={sentinelRef} className="h-4 w-full" />
        {isFetchingNextPage && (
          <LpLoadingNotice text="다음 목록을 불러오는 중입니다…" />
        )}
        {!hasNextPage && lpList.length > 0 && (
          <div className="py-6 text-center text-sm text-gray-500">
            더 이상 불러올 LP가 없습니다.
          </div>
        )}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff00b3] text-3xl font-bold text-white shadow-lg transition-transform hover:scale-105"
            aria-label="새 LP 작성"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
              <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" />
            </svg>
          </button>
        </div>
        <CreateLpModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateLp}
          isSubmitting={createLpMutation.isPending}
        />
        </>
      )}
    </div>
  )
}
