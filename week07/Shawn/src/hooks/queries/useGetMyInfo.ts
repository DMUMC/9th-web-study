import { useQuery } from "@tanstack/react-query"
import { getMyInfo } from "../../apis/auth"
import { useAuth } from "../../context/AuthContext"
import { QUERY_KEY } from "../../constant/key"

const useGetMyInfo = () => {
    const { accessToken } = useAuth()
    return useQuery({
        queryKey: [QUERY_KEY.myinfo],
        queryFn: () => getMyInfo(),
        enabled: !!accessToken,
        staleTime: Infinity,
        gcTime: Infinity
    })
}

export default useGetMyInfo