import { useState, useRef } from 'react'; // useRef 추가
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import FloatingActionButton from '../components/FloatingActionButton';
import LpCreateModal from '../components/LpCreateModal';
import useThrottle from '../hooks/useThrottle'; // ✅ Hook 임포트

const HomeLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // ✅ 스크롤 위치 상태 관리
    const [scrollTop, setScrollTop] = useState(0);
    // ✅ 스크롤이 발생할 영역(section)에 대한 Ref
    const scrollRef = useRef<HTMLElement>(null);

    // ✅ useThrottle 적용: 300ms마다 스크롤 위치 값 갱신
    const throttledScrollTop = useThrottle(scrollTop, 300);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // ✅ 스크롤 이벤트 핸들러
    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    // ✅ 맨 위로 가기 기능
    const scrollToTop = () => {
        scrollRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="h-dvh flex flex-col">
            <Navbar
                onToggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
            />

            <main className="relative mt-20 flex flex-1 bg-gray-50 overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                
                {/* ✅ onScroll 이벤트 연결 및 ref 할당 */}
                <section 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth"
                >
                    <Outlet />
                </section>

                {/* ✅ Throttling된 스크롤 값이 300px 이상일 때만 버튼 표시 */}
                {throttledScrollTop > 300 && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-24 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg transition hover:bg-gray-700 focus:outline-none animate-fade-in-up"
                        aria-label="맨 위로 스크롤"
                    >
                        <svg 
                            className="h-6 w-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M5 10l7-7m0 0l7 7m-7-7v18" 
                            />
                        </svg>
                    </button>
                )}
            </main>

            <Footer />
            <FloatingActionButton onClick={openModal} />
            <LpCreateModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

export default HomeLayout;