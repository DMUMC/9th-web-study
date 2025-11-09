// src/App.tsx

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WelcomeData from './components/WelcomeData';

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

function App() {
    return (
        // 애플리케이션 전체에서 React Query의 기능을 사용할 수 있도록 Provider로 감쌉니다.
        <QueryClientProvider client={queryClient}>
            <WelcomeData />
        </QueryClientProvider>
    );
}

export default App;
