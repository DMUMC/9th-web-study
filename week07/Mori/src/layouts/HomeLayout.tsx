import { useEffect, useRef, useState } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "../components/Header"
import { Sidebar } from "../components/Sidebar"

export const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const hideTimerRef = useRef<number | null>(null)

  const openSidebar = () => {
    if (isSidebarVisible) return
    setIsSidebarVisible(true)
    requestAnimationFrame(() => setIsSidebarOpen(true))
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
    }
    hideTimerRef.current = window.setTimeout(() => {
      setIsSidebarVisible(false)
      hideTimerRef.current = null
    }, 300)
  }

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      closeSidebar()
    } else {
      openSidebar()
    }
  }

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-dvh bg-black">
      <header className="sticky top-0 z-50">
        <Header onSidebarToggle={toggleSidebar} />
      </header>
      <div className="flex">
        <aside className="sticky top-12 hidden h-[calc(100dvh-3rem)] overflow-y-auto md:block md:w-56 lg:w-64">
          <Sidebar />
        </aside>
        <main className="min-h-dvh flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {isSidebarVisible && (
        <div className="fixed inset-x-0 top-12 bottom-0 z-40 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={closeSidebar}
            aria-label="사이드바 닫기"
          />
          <div
            className={`relative z-50 h-full w-64 max-w-[80vw] transform transition-transform duration-300 ease-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar onNavigate={closeSidebar} />
          </div>
        </div>
      )}
    </div>
  )
}
