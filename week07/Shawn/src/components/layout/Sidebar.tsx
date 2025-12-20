import { NavLink } from "react-router"
import { useAuth } from "../../context/AuthContext"
import { useLeaveModal } from "../../store/useLeaveModal"

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { accessToken } = useAuth()
    const { setIsLeaveModalOpen } = useLeaveModal()
    return (
        <>
            {isOpen && (
                <div
                    className="fixed left-0 right-0 top-16 bottom-0 z-30 bg-black/40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <nav
                className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-64 flex-col overflow-y-auto bg-neutral-800 p-4 transition-transform duration-300 lg:static lg:h-auto lg:translate-x-0 lg:flex ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}
            >
                <div className='flex flex-col gap-8'>
                    <NavLink to='/' className='flex items-center gap-2 text-white' onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
                        <p>찾기</p>
                    </NavLink>
                    <NavLink to='/mypage' className='flex items-center gap-2 text-white' onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <p>마이페이지</p>
                    </NavLink>
                    <NavLink to='/lps' className='flex items-center gap-2 text-white' onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-icon lucide-list"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>
                        <p>LP 목록</p>
                    </NavLink>
                </div>

                {accessToken && (
                <button
                    type="button"
                    className='mt-auto text-sm text-neutral-400 transition hover:text-neutral-200'
                    onClick={() => setIsLeaveModalOpen(true)}
                    >
                        탈퇴하기
                    </button>
                )}
            </nav>
        </>
    )
}