// src/components/UserDisplay.tsx (완전한 최종본)

import { useQuery } from '@tanstack/react-query';
import type { User } from '../hooks/types';
import type { FC } from 'react';

interface UserDisplayProps {
    userId: number;
}

const UserDisplay: FC<UserDisplayProps> = ({ userId }) => {
    // 💡 최종 수정: userId가 1111일 때 404 에러를 유발할 엔드포인트로 설정
    const url =
        userId === 1111
            ? `https://jsonplaceholder.typicode.com/users/1111` // 존재하지 않는 유저 ID
            : `https://jsonplaceholder.typicode.com/users/${userId}`;

    const queryKey = ['user', userId]; // 쿼리 키: 캐시 식별자

    // useQuery 훅: 서버 상태 관리를 위한 핵심
    const {
        data,
        isPending, // 로딩 상태
        isError, // 에러 상태
    } = useQuery<User>({
        queryKey: queryKey,

        // 쿼리 함수: 데이터를 가져오는 비동기 로직
        queryFn: async ({ signal }) => {
            const response = await fetch(url, { signal }); // 요청 취소(Abort)는 signal로 자동 처리

            if (!response.ok) {
                // 404 에러가 발생하면 여기서 throw되어 재시도 로직이 실행됨
                throw new Error(
                    `Failed to fetch data with status: ${response.status}`
                );
            }
            return response.json();
        },

        // 재시도 횟수
        retry: 3,

        // 재시도 지연 시간: 지수 백오프 전략 (1, 2, 4, 8...초) + 최대 30초 제한
        retryDelay: (attemptIndex) => {
            const delay = 1000 * Math.pow(2, attemptIndex);
            return Math.min(delay, 30 * 1000);
        },

        // 캐시 유효 시간 (Stale Time): 5분.
        staleTime: 5 * 60 * 1000,

        // 가비지 컬렉션 시간 (GC Time): 10분.
        gcTime: 10 * 60 * 1000,
    });

    if (isPending) {
        return <div>로딩 중...</div>;
    }

    if (isError) {
        return <div>❌ 에러 발생 (유저 ID: **{userId}**)</div>;
    }

    return (
        <div
            style={{
                padding: '10px',
                border: '1px solid #ccc',
                margin: '10px 0',
            }}
        >
            <h3>User ID: **{userId}**</h3>
            {data ? (
                <>
                    <p>이름: {data.name}</p>
                    <p>이메일: {data.email}</p>
                </>
            ) : (
                <p>데이터 없음</p>
            )}
        </div>
    );
};

export default UserDisplay;
