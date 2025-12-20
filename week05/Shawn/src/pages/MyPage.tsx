import { useEffect, useState } from "react"
import { getMyInfo } from "../apis/auth"
import type { ResponseMyInfoDto } from "../types/auth"
import { useAuth } from "../context/AuthContext"

const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfoDto | null>(null)
    const {logout} = useAuth()

    useEffect(() => {
        const getData = async () => {
            await getMyInfo().then((res) => {
                console.log(res)
                setData(res)
            })
        }

        getData()
    },[])

    const handleLogout = async () => {
        await logout()
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">My Page</h1>
            <div>
                <p>{data?.data.name}</p>
                <p>{data?.data.email}</p>
                <p>{data?.data.bio}</p>
                <button className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer mt-8" onClick={handleLogout}>로그아웃</button>
            </div>
        </div>
    )
}

export default MyPage