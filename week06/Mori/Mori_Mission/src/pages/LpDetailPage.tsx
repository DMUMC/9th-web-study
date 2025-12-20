import { useMemo, useRef, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { getLpComments, getLpDetail } from "../apis/lp"
import { LpErrorState, LpLoadingNotice, LpSkeletonGrid } from "../components/LpFallbacks"
import { LpDetailContent } from "../components/LpDetailContent"
import { LpCommentsSection } from "../components/LpCommentsSection"
import type { LpCommentItem, LpOrder } from "../types/lp"

export const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>()
  const parsedId = Number(lpid)
  const isValidLpId = Number.isInteger(parsedId) && parsedId > 0
  const commentsSentinelRef = useRef<HTMLDivElement | null>(null)
  const [commentOrder, setCommentOrder] = useState<LpOrder>("asc")

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

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchComments,
  } = useInfiniteQuery({
    queryKey: ["lpComments", parsedId, commentOrder],
    enabled: isValidLpId,
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getLpComments(parsedId, {
        cursor: pageParam,
        limit: 10,
        order: commentOrder,
      }),
    getNextPageParam: (lastPage) => (lastPage.data.hasNext ? lastPage.data.nextCursor : undefined),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  })

  const comments = useMemo<LpCommentItem[]>(() => {
    if (!commentsData) return []
    return commentsData.pages.flatMap((page) => page.data.data)
  }, [commentsData])

  useEffect(() => {
    const target = commentsSentinelRef.current
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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

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
          <LpDetailContent lpDetail={lpDetail} />
          <LpCommentsSection
            commentOrder={commentOrder}
            onChangeOrder={setCommentOrder}
            isCommentsLoading={isCommentsLoading}
            isCommentsError={isCommentsError}
            comments={comments}
            onRetry={() => refetchComments()}
            commentsSentinelRef={commentsSentinelRef}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </article>
      )}
    </div>
  )
}
