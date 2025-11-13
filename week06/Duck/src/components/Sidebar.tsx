import { Link } from "react-router-dom"

interface SidebarProps {
  onNavigate?: () => void
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const handleNavigate = () => {
    onNavigate?.()
  }

  return (
    <nav className="flex h-full w-full flex-col gap-4 bg-[#171717] p-6 text-white shadow-lg md:h-full md:shadow-none">
      <div
        onClick={handleNavigate}
        className="w-full text-sm font-medium"
      >
        검색
      </div>
      <Link
        to="/mypage"
        onClick={handleNavigate}
        className="w-full text-sm font-medium"
      >
        마이페이지
      </Link>
    </nav>
  )
}
