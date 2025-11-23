import { useCallback, useEffect, useRef, useState } from "react"

export function useSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const hideTimerRef = useRef<number | null>(null)

  // Sidebar를 닫는 함수
  const close = useCallback(() => {
    setIsSidebarOpen(false)
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
    }
    hideTimerRef.current = window.setTimeout(() => {
      setIsSidebarVisible(false)
      hideTimerRef.current = null
    }, 300)
  }, [])

  // Sidebar를 여는 함수
  const open = useCallback(() => {
    if (isSidebarVisible) return
    setIsSidebarVisible(true)
    requestAnimationFrame(() => setIsSidebarOpen(true))
  }, [isSidebarVisible])

  // Sidebar 상태를 토글하는 함수
  const toggle = useCallback(() => {
    if (isSidebarOpen) {
      close()
    } else {
      open()
    }
  }, [isSidebarOpen, close, open])

  // 사이드바 열림/닫힘 상태에 따라 배경 스크롤 제어
  useEffect(() => {
    if (isSidebarOpen) {
      // 사이드바가 열릴 때 배경 스크롤 막기
      const originalBodyOverflow = document.body.style.overflow
      const originalHtmlOverflow = document.documentElement.style.overflow
      
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
      
      return () => {
        // 사이드바가 닫힐 때 배경 스크롤 복원
        document.body.style.overflow = originalBodyOverflow
        document.documentElement.style.overflow = originalHtmlOverflow
      }
    } else {
      // 사이드바가 닫혔을 때 배경 스크롤 복원
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [isSidebarOpen])

  // ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSidebarOpen) {
        console.log("ESC 키 눌림 : 사이드바 닫기")
        close()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => {
      window.removeEventListener("keydown", handleEscape)
    }
  }, [isSidebarOpen, close])

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
    }
  }, [])

  return {
    isSidebarOpen,
    isSidebarVisible,
    open,
    close,
    toggle,
  }
}

