import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  accessToken: string | null
  setLogin: (token: string) => void
  setLogout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      setLogin: (token: string) => set({ 
        isLoggedIn: true, 
        accessToken: token 
      }),
      setLogout: () => set({ 
        isLoggedIn: false, 
        accessToken: null 
      }),
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
      partialize: (state) => ({ 
        isLoggedIn: state.isLoggedIn, 
        accessToken: state.accessToken 
      }), // 저장할 상태만 선택
    }
  )
)
