import { Outlet } from "react-router-dom"
import { Header } from "../components/Header"
import { Sidebar } from "../components/Sidebar"
import { useSidebar } from "../hooks/useSidebar"

export const HomeLayout = () => {
  const { isSidebarOpen, isSidebarVisible, close, toggle } = useSidebar()

  return (
    <div className="min-h-dvh bg-black">
      <header className="sticky top-0 z-50">
        <Header onSidebarToggle={toggle} />
      </header>
      <div className="flex">
        <main className="min-h-dvh flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {isSidebarVisible && (
        <div className="fixed inset-x-0 top-12 bottom-0 z-40 flex">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={close}
            aria-label="사이드바 닫기"
          />
          <div
            className={`relative z-50 h-full w-64 max-w-[80vw] md:max-w-none md:w-56 lg:w-64 transform transition-transform duration-300 ease-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar onNavigate={close} />
          </div>
        </div>
      )}
    </div>
  )
}
