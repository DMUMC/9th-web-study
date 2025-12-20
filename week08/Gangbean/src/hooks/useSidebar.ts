import { useEffect, useState } from 'react';

/**
 * Sidebar 상태 관리 커스텀 훅
 * @returns Sidebar 열림/닫힘 상태와 제어 함수들
 */
function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const open = () => {
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    const toggle = () => {
        setIsOpen((prev) => !prev);
    };

    // ESC 키로 Sidebar 닫기
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // 클린업 함수로 EventListener 제거 (메모리 누수 방지)
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // 배경 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            // 사이드바가 열렸을 때 body 스크롤 방지
            document.body.style.overflow = 'hidden';
        } else {
            // 사이드바가 닫혔을 때 body 스크롤 복원
            document.body.style.overflow = '';
        }

        // 클린업 함수로 스타일 복원
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
}

export default useSidebar;

