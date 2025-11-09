// src/components/WelcomeData.tsx

import React, { useState } from 'react';
import UserDisplay from './UserDisplay';

function getRandomUserId() {
    return Math.floor(Math.random() * 10) + 1;
}

const WelcomeData: React.FC = () => {
    // 추가된 상태: 재시도 테스트용 ID, 컴포넌트 렌더링 토글 상태
    const [retryUserId, setRetryUserId] = useState<number | null>(null);
    const [showRandomUser, setShowRandomUser] = useState(true); // '다른 사용자 불러오기' 토글

    // 기존 '다른 사용자 불러오기' 목록
    const [randomUserIds, setRandomUserIds] = useState([1]);

    // '다른 사용자 불러오기' 핸들러
    const handleFetchRandomUser = () => {
        const newUserId = getRandomUserId();
        setRandomUserIds((prevIds) => [...prevIds, newUserId]);
        // 재시도 테스트는 목록에 추가하지 않습니다.
        if (retryUserId) setRetryUserId(null);
    };

    // '재시도 테스트 (404 에러)' 핸들러
    const handleRetryTest = () => {
        // 404를 유발할 ID
        setRetryUserId(1111);
    };

    return (
        <div>
            <h1>React Query</h1>

            {/* 버튼 그룹 */}
            <div
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}
            >
                <button
                    onClick={() => setShowRandomUser((prev) => !prev)}
                    style={{
                        padding: '10px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        backgroundColor: showRandomUser ? '#4CAF50' : '#f44336',
                        color: 'white',
                    }}
                >
                    다른 사용자 불러오기 컴포넌트 토글 (
                    {showRandomUser ? 'ON' : 'OFF'})
                </button>

                <button
                    onClick={handleRetryTest}
                    style={{
                        padding: '10px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        backgroundColor: '#FF9800',
                        color: 'black',
                    }}
                >
                    재시도 테스트 (404 에러 유발)
                </button>

                <button
                    onClick={handleFetchRandomUser}
                    style={{
                        padding: '10px',
                        fontSize: '14px',
                        cursor: 'pointer',
                    }}
                >
                    다른 사용자 불러오기
                </button>
            </div>

            {/* 렌더링 로직 */}
            {/* 1. 재시도 테스트 컴포넌트 렌더링 */}
            {retryUserId && (
                <UserDisplay key="retry-test" userId={retryUserId} />
            )}

            {/* 2. 기존 랜덤 유저 목록 렌더링 */}
            {showRandomUser &&
                randomUserIds.map((id, index) => (
                    <UserDisplay key={index} userId={id} />
                ))}
        </div>
    );
};

export default WelcomeData;
