import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FiSettings } from "react-icons/fi"
import { getMyInfo, updateMyInfo } from "../apis/auth"
import { ProfileEditModal } from "../components/ProfileEditModal"
import { useAuthStore } from "../store/authStore";
import type { ResponseMyInfoDto } from "../types/auth";

export const MyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { setLogin, accessToken, refreshToken } = useAuthStore()

  const {
    data: userInfoResponse,
    isLoading: loading,
    isError,
  } = useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
  })

  const userInfo = userInfoResponse?.data ?? null

  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string; bio: string | null; avatar: string | null }) =>
      updateMyInfo({
        name: data.name,
        bio: data.bio,
        avatar: data.avatar,
      }),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] })

      const previousUserInfo = queryClient.getQueryData<ResponseMyInfoDto>(["myInfo"])
      const previousUserName = useAuthStore.getState().userName

      if (previousUserInfo) {
        queryClient.setQueryData<ResponseMyInfoDto>(["myInfo"], {
          ...previousUserInfo,
          data: {
            ...previousUserInfo.data,
            name: newData.name, 
          },
        })
      }
      if (accessToken && refreshToken) {
        setLogin(accessToken, refreshToken, newData.name)
      }

      return { previousUserInfo, previousUserName }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myInfo"] })
      setIsModalOpen(false)
    },
    onError: (error, newData, context) => {
      console.error("프로필 수정 실패:", error)
      alert("프로필 수정에 실패했습니다. 다시 시도해주세요.")

      if (context?.previousUserInfo) {
        queryClient.setQueryData(["myInfo"], context.previousUserInfo)
      }
      
      if (accessToken && refreshToken) {
        setLogin(accessToken, refreshToken, context?.previousUserName ?? null)
      }
    },
    onSettled: (data) => {
      setIsModalOpen(false)
      
      queryClient.invalidateQueries({ queryKey: ["myInfo"] }).then(() => {
        const latestData = queryClient.getQueryData<ResponseMyInfoDto>(["myInfo"]);
        const serverName = latestData?.data?.name ?? data?.data?.name ?? null;

        if (accessToken && refreshToken) {
          setLogin(accessToken, refreshToken, serverName)
        }
      })
    },
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <div className="text-red-500 text-lg">사용자 정보를 가져오는데 실패했습니다.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <div className="w-140 my-12 bg-[#202020] rounded-lg p-8 border border-white relative">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="absolute top-8 right-8 rounded-full p-2 text-gray-400 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          aria-label="설정"
        >
          <FiSettings size={24} />
        </button>
        <h1 className="text-3xl font-bold text-white mb-8 text-center">마이페이지</h1>
        <h2 className="text-xl font-semibold text-white mb-4">프로필 정보</h2>
        <div className="flex flex-col items-center mb-6">
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo.name}
              className="h-32 w-32 rounded-full object-cover border-2 border-[#ff00b3]"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#ff00b3]/30 text-4xl font-semibold text-[#ffb0e5] border-2 border-[#ff00b3]">
              {userInfo?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <>
            <span className="text-sm font-medium text-gray-400">닉네임</span>
            <p className="text-lg text-white mt-1">{userInfo?.name || "정보 없음"}</p>
          </>
          <>
            <span className="text-sm font-medium text-gray-400">이메일</span>
            <p className="text-lg text-white mt-1">{userInfo?.email || "정보 없음"}</p>
          </>
          <>
            <span className="text-sm font-medium text-gray-400">소개</span>
            <p className="text-lg text-white mt-1">{userInfo?.bio || "소개가 없습니다."}</p>
          </>
          <>
            <span className="text-sm font-medium text-gray-400">가입일</span>
            <p className="text-lg text-white mt-1">
              {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('ko-KR') : "정보 없음"}
            </p>
          </>
        </div>
      </div>
      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(data) => updateProfileMutation.mutate(data)}
        initialData={userInfo}
      />
    </div>
  )
}
