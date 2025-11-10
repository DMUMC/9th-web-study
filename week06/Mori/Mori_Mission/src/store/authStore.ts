import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  accessToken: string | null
  refreshToken: string | null
  userName: string | null
  setLogin: (accessToken: string, refreshToken: string, userName?: string | null) => void
  setLogout: () => void
  updateTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      userName: null,
      setLogin: (accessToken: string, refreshToken: string, userName?: string | null) => set({ 
        isLoggedIn: true, 
        accessToken,
        refreshToken,
        userName: userName ?? null
      }),
      setLogout: () => set({ 
        isLoggedIn: false, 
        accessToken: null,
        refreshToken: null,
        userName: null
      }),
      updateTokens: (accessToken: string, refreshToken: string) => set({
        accessToken,
        refreshToken
      }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({ 
        isLoggedIn: state.isLoggedIn, 
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userName: state.userName
      }), // 저장할 상태만 선택
    }
  )
)
