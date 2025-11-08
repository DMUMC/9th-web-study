// src/pages/MyPage.tsx

import { useAuth } from "../context/AutoContext";

export const MyPage = () => {
  const { userEmail, logout } = useAuth(); 

  return (
    <div className="p-8 bg-neutral-800 rounded-lg shadow-lg text-white w-full max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">My Page</h1>
      <div className="space-y-4">
        <p className="text-lg">
          <span className="font-semibold text-gray-400">이메일: </span>
          {userEmail || '이메일 정보가 없습니다.'}
        </p>
      </div>
      <button
        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors mt-8 font-bold"
        onClick={logout}
      >
        로그아웃
      </button>
    </div>
  );
};