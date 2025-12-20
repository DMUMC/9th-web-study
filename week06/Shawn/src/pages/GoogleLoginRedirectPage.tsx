import { useEffect } from "react"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { LOCAL_STORAGE_KEY } from "../constant/key"

const GoogleLoginRedirectPage = () => {
    const {setItem: setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    const {setItem: setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.REFRESH_TOKEN)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.REFRESH_TOKEN)

        if(!accessToken || !refreshToken) {
            return
        }

        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
        window.location.href = '/mypage'
    }, [ setAccessToken, setRefreshToken])
    return null
}

export default GoogleLoginRedirectPage