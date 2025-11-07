// React의 핵심 기능들을 가져옵니다.
import { createContext, useContext, useState } from 'react';
// 로그인 요청 시 필요한 데이터의 타입을 가져옵니다.
import type { RequestSigninDto } from '../types/auth';
// 로컬 저장소(LocalStorage)를 쉽게 사용할 수 있도록 만든 사용자 정의 Hook을 가져옵니다.
import { useLocalStorage } from '../hooks/useLocalStorage';
// 로컬 저장소에 키(Key)를 상수로 정의해 둔 파일을 가져옵니다. (예: "ACCESS_TOKEN")
import { LOCAL_STORAGE_KEY } from '../constant/key';
// 서버와의 통신을 담당하는 로그인 및 로그아웃 API 함수를 가져옵니다.
import { postLogout, postSignin } from '../apis/auth';
// React 컴포넌트의 children 타입을 가져옵니다.
import type { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

// 인증 컨텍스트(Context)가 제공할 값들의 타입을 정의합니다.
interface AuthContextType {
    // 사용자의 인증 상태를 나타내는 접근 토큰 (단기 티켓)
    accessToken: string | null;
    // 접근 토큰 갱신에 사용되는 갱신 토큰 (장기 티켓)
    refreshToken: string | null;
    // 로그인 기능을 수행하는 비동기 함수
    login: (signInData: RequestSigninDto) => Promise<void>;
    // 로그아웃 기능을 수행하는 비동기 함수
    logout: () => Promise<void>;
}

// 🔐 AuthContext 생성:
// 이 컨텍스트는 **공용 사물함**과 같습니다. 이 사물함에 토큰과 로그인/로그아웃 기능을 넣어두면,
// 이 사물함을 사용하는 모든 컴포넌트(사용자)가 필요한 순간에 내용을 꺼내 쓸 수 있게 됩니다.
export const AuthContext = createContext<AuthContextType>({
    // 초기 값으로 토큰은 비어있고, 함수는 아무것도 하지 않는 빈 함수로 설정합니다.
    accessToken: null,
    refreshToken: null,
    login: async () => {},
    logout: async () => {},
});

// AuthProvider 컴포넌트:
// 이 컴포넌트는 위에서 만든 **공용 사물함(AuthContext)에 실제 내용물을 채워넣는 관리자** 역할입니다.
// 이 컴포넌트의 자식들(Children)은 모두 이 사물함의 내용물을 물려받아 사용할 수 있습니다.
export const AuthProvider = ({ children: Children }: PropsWithChildren) => {
    // 🔑 useLocalStorage를 사용하여 Access Token(접근 토큰) 관련 함수들을 가져옵니다.
    // 이 부분은 **열쇠를 보관하는 금고**를 만드는 것과 같습니다.
    const {
        getItem: getAccessTokenFromStorage, // 금고에서 열쇠(토큰)를 가져오는 기능
        setItem: setAccessTokenInStorage, // 금고에 열쇠(토큰)를 넣는 기능
        removeItem: removeAccessTokenFromStorage, // 금고에서 열쇠(토큰)를 제거하는 기능
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    // 🔄 useLocalStorage를 사용하여 Refresh Token(갱신 토큰) 관련 함수들을 가져옵니다.
    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    // 현재 **메모리(RAM)** 상의 Access Token 상태를 관리합니다.
    // 초기 값은 로컬 저장소(Local Storage)에 저장되어 있던 값으로 설정합니다.
    // VS Code를 껐다 켜도 이전에 로그인되어 있었다면 토큰을 다시 가져와 상태를 유지합니다.
    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage()
    );

    // 현재 **메모리(RAM)** 상의 Refresh Token 상태를 관리합니다.
    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage()
    );

    // 🚀 로그인 기능:
    const login = async (signData: RequestSigninDto) => {
        try {
            // 1. 서버에 로그인 요청을 보냅니다.
            const { data } = await postSignin(signData);

            // 2. 서버에서 받은 새로운 토큰을 변수에 저장합니다.
            const newAccessToken: string = data.accessToken;
            const newRefreshToken: string = data.refreshToken;

            // 3. React 상태(State, 즉 메모리)에 새로운 토큰을 반영합니다. (화면 갱신용)
            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);

            // 4. 로컬 저장소(LocalStorage, 즉 영구 저장소)에 새로운 토큰을 저장합니다.
            setAccessTokenInStorage(newAccessToken);
            setRefreshTokenInStorage(newRefreshToken);

            alert('로그인 성공');
            // 5. 로그인 성공 후 '/my' 페이지로 이동합니다.
            window.location.href = '/my';
        } catch (error) {
            console.error('로그인 오류', error);
            alert('로그인 실패');
        }
    };

    // 🚪 로그아웃 기능:
    // 로그아웃은 **열쇠를 파기**하는 과정과 같습니다.
    const logout = async () => {
        try {
            // 1. (선택 사항) 서버에 로그아웃 요청을 보내 세션/토큰을 무효화합니다.
            // 이 부분에서 404 오류가 나도 괜찮습니다.
            await postLogout();
            
        } catch (error) {
            console.error('로그아웃 오류(서버 통신 실패)', error);
            alert('로그아웃 실패 (네트워크 또는 서버 오류)');
        } finally {
            // 2. 서버 통신 성공/실패와 관계없이 로컬에서 열쇠를 파기하고 상태 초기화
            removeAccessTokenFromStorage(); // 로컬 저장소에서 제거
            removeRefreshTokenFromStorage();
            setAccessToken(null); // 메모리 상태 초기화
            setRefreshToken(null);
            alert('로컬 인증 정보가 삭제되었습니다.'); // 사용자에게 삭제 완료 알림
            // 3. 로그아웃 후 '/login' 페이지로 이동
            window.location.href = '/';
        }
    };

    // ✨ Provider를 통해 실제 데이터와 함수를 하위 컴포넌트들에게 제공합니다.
    return (
        <AuthContext.Provider
            value={{ accessToken, refreshToken, login, logout }}
        >
            {Children}
        </AuthContext.Provider>
    );
};

// useAuth Hook:
// 이 Hook은 **공용 사물함(AuthContext)에서 내용물을 꺼내 쓰는 전문 도구**입니다.
// 이 도구를 사용하면 AuthProvider 컴포넌트 안에 있는 어떤 컴포넌트라도 쉽게 인증 정보를 사용할 수 있습니다.
export const useAuth = () => {
    // 1. AuthContext에서 현재 값을 가져옵니다.
    const context = useContext(AuthContext);
    // 2. 만약 context가 없다는 것은 AuthProvider로 감싸지 않았다는 뜻이므로 에러를 발생시킵니다.
    if (!context) {
        throw new Error('AuthContext를 찾을 수 없습니다.');
    }
    // 3. 인증 관련 정보와 함수를 반환합니다.
    return context;
};
