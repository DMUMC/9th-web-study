import { postLogin, postLogout } from "../apis/auth"
import { LOCAL_STORAGE_KEY } from "../constant/key"
import { useLocalStorage } from "../hooks/useLocalStorage"
import  type { RequestLoginDto } from "../types/auth"
import { createContext, useContext, useState, type PropsWithChildren } from "react"

export interface AuthContextType {
	accessToken: string | null
	refreshToken: string | null
	logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
	accessToken: null,
	refreshToken: null,
	logout: () => {},
})

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const { setItem: setAccessTokenStorage, getItem: getAccessTokenStorage, removeItem: removeAccessTokenStorage } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
	const { setItem: setRefreshTokenStorage, getItem: getRefreshTokenStorage, removeItem: removeRefreshTokenStorage } = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)

	const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenStorage())
	const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenStorage())

	const logout = async () => {
		try {
			await postLogout()
			setAccessToken(null)
			setRefreshToken(null)
			removeAccessTokenStorage()
			removeRefreshTokenStorage()
			alert('로그아웃에 성공했습니다.')
			window.location.href = '/'
		} catch (error) {
			console.error(error)
			alert('로그아웃에 실패했습니다.')
		}
	}

	return <AuthContext.Provider value={{ accessToken, refreshToken, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(!context) {
        throw new Error('AuthContext not found')
    }
    return context
}