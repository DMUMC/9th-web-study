import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfoDto } from "../types/auth";

export const MyPage = () => {
  const [userInfo, setUserInfo] = useState<ResponseMyInfoDto["data"] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await getMyInfo();
        setUserInfo(response.data);
      } catch {
        setError("사용자 정보를 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <div className="text-white text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black">
      <div className="w-140 my-12 bg-[#202020] rounded-lg p-8 border border-white">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          마이페이지
        </h1>
        <h2 className="text-xl font-semibold text-white mb-4">프로필 정보</h2>
        <div className="space-y-4">
          <div>
            <span className="text-sm font-medium text-gray-400">닉네임</span>
            <p className="text-lg text-white mt-1">
              {userInfo?.name || "정보 없음"}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-400">이메일</span>
            <p className="text-lg text-white mt-1">
              {userInfo?.email || "정보 없음"}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-400">소개</span>
            <p className="text-lg text-white mt-1">
              {userInfo?.bio || "소개가 없습니다."}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-400">가입일</span>
            <p className="text-lg text-white mt-1">
              {userInfo?.createdAt
                ? new Date(userInfo.createdAt).toLocaleDateString("ko-KR")
                : "정보 없음"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
