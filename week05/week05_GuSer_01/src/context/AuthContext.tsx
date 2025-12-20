import { createContext, useContext, useState } from "react";
import type { RequestLoginDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constant/key";
import { postLogout, postLogin } from "../apis/auth";
import type { PropsWithChildren } from "react";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signInData: RequestLoginDto) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children: Children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN);

  const [accessToken, setAccessToken] = useState<string | null>(
    getAccessTokenFromStorage()
  );

  const [refreshToken, setRefreshToken] = useState<string | null>(
    getRefreshTokenFromStorage()
  );

  // 로그인
  const login = async (signData: RequestLoginDto) => {
    try {
      // postLogin은 CommonResponse<{ accessToken, refreshToken, ... }> 형태를 반환
      const { data } = await postLogin(signData);

      const newAccessToken: string = data.accessToken;
      const newRefreshToken: string = data.refreshToken;

      // 상태 반영
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);

      // 로컬스토리지 저장(JSON.stringify로 저장됨)
      setAccessTokenInStorage(newAccessToken);
      setRefreshTokenInStorage(newRefreshToken);

      alert("로그인 성공");
      // 보호 페이지로 이동 (기존 로직 유지)
      window.location.href = "/my";
    } catch (error) {
      console.error("로그인 오류", error);
      alert("로그인 실패");
    }
  };

  // 로그아웃 (서버 유무와 무관하게 항상 클라이언트 토큰 제거)
  const logout = async () => {
    try {
      // 서버에 signout 엔드포인트가 있으면 호출, 없으면 실패해도 됨
      await postLogout();
      // 성공 알림은 선택 사항. 유지하려면 아래 주석 해제
      // alert("로그아웃 성공");
    } catch (error) {
      // ❌ UX를 해치던 "로그아웃 실패" 알림은 제거
      console.warn("서버 로그아웃 실패 - 클라이언트 토큰만 제거합니다.", error);
    } finally {
      // ✅ 서버 성공/실패와 무관하게 항상 로컬 토큰 제거
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      // 내비게이션은 호출 측(MyPage 등)에서 처리 (기존 로직 유지)
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, login, logout }}>
      {Children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext를 찾을 수 없습니다.");
  }
  return context;
};

