import { Navigate } from "react-router"
import { useAuth } from "../../context/AuthContext"
import { Layout } from "./Layout"

const ProtectedLayout = () => {
    const {accessToken} = useAuth()

    if(!accessToken) {
        return <Navigate to="/login" replace />
    }

    return (
        <>
            <Layout />
        </>
    )
}

export default ProtectedLayout