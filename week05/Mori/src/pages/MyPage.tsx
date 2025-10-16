import { useEffect, useState } from "react"
import { getMyInfo } from "../apis/auth"
import type { ResponseMyInfoDto } from "../types/auth"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { useNavigate } from "react-router-dom"

export const MyPage = () => {
  const [userInfo, setUserInfo] = useState<ResponseMyInfoDto["data"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, setAccessToken] = useLocalStorage<string | null>('accessToken', null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true)
        const response = await getMyInfo()
        setUserInfo(response.data)
      } catch (err) {
        setError("사용자 정보를 가져오는데 실패했습니다.")
        console.error("Failed to fetch user info:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  const handleLogout = () => {
    setAccessToken(null)
    navigate('/')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <div className="w-140 my-12 bg-[#202020] rounded-lg p-8 border border-white">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">마이페이지</h1>
        <h2 className="text-xl font-semibold text-white mb-4">프로필 정보</h2>
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
         
         <div className="mt-8 pt-4 border-t border-gray-600">
           <button 
             onClick={handleLogout}
             className="bg-[#ff00b3] text-white py-1 px-4 rounded-md text-sm 
             hover:bg-[#b3007d] transition-colors cursor-pointer"
           >
             로그아웃
           </button>
         </div>
       </div>
     </div>
   )
}
