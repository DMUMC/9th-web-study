import { useEffect, useState } from "react"

export const useCurrentPath = () => {
    const [currentPath, setCurrentPath] = useState(window.location.pathname)

    useEffect(() => {
        const handlePopState = () => {
            setCurrentPath(window.location.pathname)
        }
        window.addEventListener('popstate', handlePopState)
        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    return currentPath
}