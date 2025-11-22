import { useState, useCallback } from 'react';

/**
 * Sidebar의 열림/닫힘 상태를 관리하는 커스텀 훅
 * 
 * @returns {Object} Sidebar 상태와 제어 함수들
 * @returns {boolean} isOpen - Sidebar가 열려있는지 여부
 * @returns {Function} open - Sidebar를 여는 함수
 * @returns {Function} close - Sidebar를 닫는 함수
 * @returns {Function} toggle - Sidebar 상태를 토글하는 함수
 * 
 * @example
 * const { isOpen, open, close, toggle } = useSidebar();
 */
function useSidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    const toggle = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    return {
        isOpen,
        open,
        close,
        toggle,
    };
}

export default useSidebar;

