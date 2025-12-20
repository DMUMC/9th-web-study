import { NavLink, useNavigate } from "react-router"
import { useAuth } from "../../context/AuthContext"
import useGetMyInfo from "../../hooks/queries/useGetMyInfo"
import { useLogout } from "../../hooks/mutation/auth/useLogout"

interface NavbarProps {
    onMenuClick: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
    const navigate = useNavigate()
    const { accessToken } = useAuth()
    const { data } = useGetMyInfo()
    const logoutMutation = useLogout()

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    return (
        <div className='flex justify-between items-center p-4 bg-neutral-800 z-50'>
            <div className='flex items-center gap-2'>
                <button
                    type="button"
                    className="lg:hidden text-white hover:text-teal-400 transition"
                    onClick={onMenuClick}
                    aria-label="사이드바 열기"
                >
                    <svg width="36" height="36" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
                    </svg>
                </button>
                <div className="hidden lg:block">
                    <svg width="36" height="36" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
                    </svg>
                </div>
                <p className='font-bold text-2xl text-teal-500 hover:cursor-pointer' onClick={() => navigate('/')}>
                    돌려돌려 LP판
                </p>
            </div>
			<div className='flex gap-4 items-center'>
				{accessToken ? (
					<>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
						<p>{data?.data.name}님 반갑습니다.</p>
                        <p className="text-sm hover:cursor-pointer" onClick={handleLogout}>로그아웃</p>
					</>
				) : (
					<>
						<NavLink className='rounded-2xl bg-neutral-900 px-4 py-2 font-bold' to='/login'>
							로그인
						</NavLink>
						<NavLink className='rounded-2xl bg-teal-500 px-4 py-2 font-bold' to='/signup'>
							회원가입
						</NavLink>
					</>
				)}
			</div>
		</div>
    )
}