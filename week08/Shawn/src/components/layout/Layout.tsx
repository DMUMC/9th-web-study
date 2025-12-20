import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { FloatingButton } from '../FloatingButton'
import LpModal from '../LpModal'
import useLpModal from '../../store/useLpModal'
import { useLeaveModal } from '../../store/useLeaveModal'
import { LeaveModal } from './LeaveModal'
import { useThrottleCallback } from '../../hooks/useThrottle'
import useSidebar from '../../hooks/useSidebar'

export const Layout = () => {
	const [isDesktop, setIsDesktop] = useState(false)
	const { isOpen } = useLpModal()
	const { isLeaveModalOpen } = useLeaveModal()
	const { isOpen: sidebarOpen, close, toggle } = useSidebar()

	// resize 이벤트에 throttle 적용 (300ms마다 한 번만 실행)
	const handleResize = useThrottleCallback(
		() => {
			setIsDesktop(window.innerWidth >= 1024)
		},
		300,
		[]
	)

	useEffect(() => {
		// 초기값 설정
		setIsDesktop(window.innerWidth >= 1024)

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [handleResize])

	useEffect(() => {
		if (isDesktop) {
			close()
		}
	}, [isDesktop, close])

	return (
		<div className='bg-neutral-900 text-neutral-200 min-h-screen min-w-screen flex flex-col'>
			{isOpen && <LpModal />}
			{isLeaveModalOpen && <LeaveModal />}
			<Navbar onMenuClick={toggle} />
			<div className='flex flex-1'>
				<Sidebar isOpen={isDesktop || sidebarOpen} onClose={close} />
				<FloatingButton />
				<div className='flex-1 flex justify-center'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}
