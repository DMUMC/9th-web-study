import { useState } from "react";
import { useCustomFetch } from '../hooks/useCustomFetch';

interface WelcomeData {
    id: number;
    name: string;
    email: string;
}

// 상위에서 사용자 ID 및 렌더링 여부를 제어하는 컨테이너 컴포넌트
export const WelcomeData = () => {
    const [userId, setUserId] = useState<number>(1);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const handleChangeUser = () : void => {
        // 같은 사용자만 반복해서 나오지 않도록 간단히 재추첨
        let randomId = Math.floor(Math.random() * 10) + 1;
        if (randomId === userId) {
            randomId = randomId === 10 ? 1 : randomId + 1;
        }
        setUserId(randomId);
    };

    const handleTestRetry = () => {
        setUserId(999999);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                position: 'fixed',
                top: 0,
                right: 0
                }}
            >
                <button onClick={handleChangeUser}>다른 사용자 불러오기</button>
                <button onClick={handleTestRetry}>
                    존재하지 않는 사용자 테스트
                </button>
                <button onClick={() : void => setIsVisible(!isVisible)}>
                    컴포넌트 토글 (언마운트 테스트)
                </button>
            </div>
        {isVisible && <UserDataDisplay userId={userId} />}

        </div>
    );
};

// 사용자 정보를 가져와 화면에 표시하는 프레젠테이션 컴포넌트
const UserDataDisplay = ({userId}: {userId:number}) => {
    const { data, isPending, isError } = useCustomFetch<WelcomeData>(
        `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    if (isPending) {
        return <div>Loading... (User Id: {userId})</div>
    }
    if (isError) {
        return <div>Error Occcurred</div>
    }

    return (
        <div>
            <h1>{data?.name}</h1>
            <p>{data?.email ?? '이메일 정보 없음'}</p>
            <p style={{ fontSize: '12px', color: '#666' }}>User ID: {data?.id}</p>
        </div>
    )
}
