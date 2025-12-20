import { useEffect, useSyncExternalStore, useMemo } from 'react';
import { authStore } from './authStore';

export function useAuth() {
  const token = useSyncExternalStore(
    (cb) => authStore.subscribe(cb),
    () => authStore.token
  );
  const isLoggedIn = useMemo(() => !!token, [token]);

  // 로컬스토리지 변경(다른 탭/프레임)도 추적
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'accessToken') authStore.setToken(localStorage.getItem('accessToken'));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { token, isLoggedIn, setToken: authStore.setToken.bind(authStore) };
}