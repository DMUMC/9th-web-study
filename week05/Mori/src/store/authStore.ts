import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  accessToken: string | null
  refreshToken: string | null
  setLogin: (accessToken: string, refreshToken: string) => void
  setLogout: () => void
  updateTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      setLogin: (accessToken: string, refreshToken: string) => set({ 
        isLoggedIn: true, 
        accessToken,
        refreshToken
      }),
      setLogout: () => set({ 
        isLoggedIn: false, 
        accessToken: null,
        refreshToken: null
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
        refreshToken: state.refreshToken
      }), // 저장할 상태만 선택
    }
  )
)
