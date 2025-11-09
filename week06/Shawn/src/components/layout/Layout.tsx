import { NavLink, Outlet, useNavigate } from "react-router"
import { useAuth } from '../../context/AuthContext'

export const Layout = () => {
    const navigate = useNavigate()
    const { accessToken } = useAuth()

    return (
			<div className='bg-neutral-900 text-neutral-200 min-h-screen min-w-screen flex flex-col'>
				<div className='flex justify-between items-center p-4 bg-neutral-800'>
					<p className='font-bold text-2xl text-teal-500 hover:cursor-pointer' onClick={() => navigate('/')}>
						돌려돌려 LP판
					</p>
					<div className='flex gap-4'>
						{accessToken ? (
							<NavLink className='rounded-2xl bg-neutral-900 px-4 py-2 font-bold' to='/mypage'>
								마이페이지
							</NavLink>
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

				<div className='flex-1 flex justify-center items-center'>
					<Outlet />
				</div>
			</div>
		)
}
