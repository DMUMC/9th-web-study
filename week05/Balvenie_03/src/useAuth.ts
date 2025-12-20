import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { authStore } from './authStore';

export function useAuth() {
  const token = useSyncExternalStore(
    (cb) => authStore.subscribe(cb),
    () => authStore.token
  );

  const isLoggedIn = useMemo(() => !!token, [token]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'accessToken') {
        // 외부 탭에서 변경 반영
        const v = localStorage.getItem('accessToken');
        authStore.setToken(v);
      }
    };
    const onAuthChanged = () => {}; // notify로 이미 구독됨. 필요시 추가 처리
    window.addEventListener('storage', onStorage);
    window.addEventListener('auth:changed', onAuthChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth:changed', onAuthChanged);
    };
  }, []);

  return {
    token,
    isLoggedIn,
    setToken: (v: string | null) => authStore.setToken(v),
    setLogout: () => authStore.logout(),       // ✅ 추가
  };
}