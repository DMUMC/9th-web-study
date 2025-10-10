import { useEffect } from "react"
import { getMyInfo } from "../api/auth"

const MyPage = () => {

    useEffect(() => {
        const getData = async () => {
            await getMyInfo().then((res) => {
                console.log(res)
            })
        }

        getData()
    },[])
    return (
        <div>
            <h1>My Page</h1>
        </div>
    )
}

export default MyPage