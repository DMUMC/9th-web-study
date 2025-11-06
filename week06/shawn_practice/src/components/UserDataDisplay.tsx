import { useState } from "react"
import { useCustomFetch } from "../hooks/useCustomFetch"

interface WelcomeData {
    id: number
    name: string
    email: string
}

export const WelcomeData = () => {
    const [userId, setUserId] = useState<number>(1)
    const [isVisible, setIsVisible] = useState<boolean>(true)

    const handleChangeUser = () => {
        const randomId = Math.floor(Math.random() * 10) + 1
        setUserId(randomId)
    }

    const handleTestRetry = () => {
        setUserId(9999999999)
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', position: 'fixed', top: '0', right: '0' }}>
                <button onClick={handleChangeUser}>다른 사용자 불러오기</button>
                <button onClick={() => setIsVisible(!isVisible)}>컴포넌트 토글</button>
                <button onClick={handleTestRetry} style={{ backgroundColor: '#ff9800', color: 'white' }}>재시도 테스트</button>
            </div>

            {isVisible && <UserDataDisplay userId={userId} />}
        </div>
    )
}

const UserDataDisplay = ({ userId }: { userId: number }) => {
    const {data, isPending, isError} = useCustomFetch<WelcomeData>(`https://jsonplaceholder.typicode.com/users/${userId}`)

    if (isPending) return <div>Loading...{userId}</div>
    if (isError) return <div>Error</div>

    return (
        <div>
            <h2>User Data</h2>
            <p>ID: {data?.id}</p>
            <p>Name: {data?.name}</p>
            <p>Email: {data?.email}</p>
        </div>
    )
}