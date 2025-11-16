import { useMemo, useRef, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteLp, getLpComments, getLpDetail, likeLp, unlikeLp, updateLp } from "../apis/lp"
import { getMyInfo } from "../apis/auth"
import { LpErrorState, LpLoadingNotice, LpSkeletonGrid } from "../components/LpFallbacks"
import { LpDetailContent } from "../components/LpDetailContent"
import { LpCommentsSection } from "../components/LpCommentsSection"
import { CreateLpModal } from "../components/CreateLpModal"
import { ConfirmModal } from "../components/ConfirmModal"
import type { LpCommentItem, LpOrder, ResponseLpDetailDto } from "../types/lp"

export const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>()
  const parsedId = Number(lpid)
  const isValidLpId = Number.isInteger(parsedId) && parsedId > 0
  const commentsSentinelRef = useRef<HTMLDivElement | null>(null)
  const [commentOrder, setCommentOrder] = useState<LpOrder>("asc")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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

  // 현재 사용자 정보 가져오기
  const { data: myInfoData } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    retry: false,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  })

  const currentUserId = useMemo(() => myInfoData?.data?.id ?? null, [myInfoData])

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

  // 좋아요 여부 확인
  const isLiked = useMemo(() => {
    if (!currentUserId || !lpDetail) return false
    return lpDetail.likes.some((like) => like.userId === currentUserId)
  }, [currentUserId, lpDetail])

  // LP 수정
  const updateLpMutation = useMutation({
    mutationFn: (data: { title: string; content: string; thumbnail: string | null; tags: string[] }) =>
      updateLp(parsedId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lp", parsedId] })
      void queryClient.invalidateQueries({ queryKey: ["lps"] })
      setIsEditModalOpen(false)
    },
    onError: (error) => {
      console.error("LP 수정 실패:", error)
      alert("LP 수정에 실패했습니다. 다시 시도해주세요.")
    },
  })

  // LP 삭제
  const deleteLpMutation = useMutation({
    mutationFn: () => deleteLp(parsedId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lps"] })
      alert("LP가 삭제되었습니다.")
      navigate("/")
    },
    onError: (error) => {
      console.error("LP 삭제 실패:", error)
      alert("LP 삭제에 실패했습니다. 다시 시도해주세요.")
    },
  })

  // LP 좋아요 토글
  const likeLpMutation = useMutation<
    ResponseLpDetailDto | void,
    Error,
    boolean,
    { previousLpDetail: ResponseLpDetailDto | undefined }
  >({
    mutationFn: (wasLiked: boolean) => {
      if (wasLiked) {
        return unlikeLp(parsedId) 
      } else {
        return likeLp(parsedId) 
      }
    },

    onMutate: async (wasLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: ["lp", parsedId] })
      const previousLpDetail = queryClient.getQueryData<ResponseLpDetailDto>(["lp", parsedId])

      if (!previousLpDetail || !currentUserId) {
        return { previousLpDetail: undefined }
      }

      let optimisticLikes
      if (wasLiked) {
        optimisticLikes = previousLpDetail.data.likes.filter(
          (like) => like.userId !== currentUserId
        )
      } else {
        const optimisticLike = {
          id: Date.now(), // 임시 ID
          userId: currentUserId,
          lpId: parsedId,
        }
        optimisticLikes = [...previousLpDetail.data.likes, optimisticLike]
      }
      queryClient.setQueryData<ResponseLpDetailDto>(["lp", parsedId], {
        ...previousLpDetail,
        data: {
          ...previousLpDetail.data,
          likes: optimisticLikes,
        },
      })

      return { previousLpDetail }
    },
      
    onError: (error, wasLiked, context) => {
      console.error(`좋아요 ${wasLiked ? '취소' : '추가'} 실패 (롤백 실행):`, error)
      if (context?.previousLpDetail) {
        queryClient.setQueryData(["lp", parsedId], context.previousLpDetail)
      }
      alert("좋아요 처리에 실패했습니다. 다시 시도해주세요.")
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["lp", parsedId] })
      void queryClient.invalidateQueries({ queryKey: ["lps"] })
    },
  })

  const handleDelete = () => {
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteLpMutation.mutate()
    setIsDeleteModalOpen(false)
  }

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
          <LpDetailContent
            lpDetail={lpDetail}
            currentUserId={currentUserId}
            isLiked={isLiked}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDelete}
            onLike={() => likeLpMutation.mutate(isLiked)}
          />
          <LpCommentsSection
            lpId={parsedId}
            currentUserId={currentUserId}
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
      <CreateLpModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={(data) => updateLpMutation.mutate(data)}
        isSubmitting={updateLpMutation.isPending}
        mode="edit"
        initialData={
          lpDetail
            ? {
                title: lpDetail.title,
                content: lpDetail.content,
                thumbnail: lpDetail.thumbnail,
                tags: lpDetail.tags.map((tag) => tag.name),
              }
            : undefined
        }
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="LP 삭제"
        message="정말 이 LP를 삭제하시겠습니까? 삭제한 LP는 복구할 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
      />
    </div>
  )
}
