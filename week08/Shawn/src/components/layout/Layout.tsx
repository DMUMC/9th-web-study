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

export const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [isDesktop, setIsDesktop] = useState(false)
	const { isOpen } = useLpModal()
	const { isLeaveModalOpen } = useLeaveModal()

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
			setIsSidebarOpen(false)
		}
	}, [isDesktop])

	const handleToggleSidebar = () => {
		setIsSidebarOpen((prev) => !prev)
	}

	const handleCloseSidebar = () => {
		setIsSidebarOpen(false)
	}

	return (
		<div className='bg-neutral-900 text-neutral-200 min-h-screen min-w-screen flex flex-col'>
			{isOpen && <LpModal />}
			{isLeaveModalOpen && <LeaveModal />}
			<Navbar onMenuClick={handleToggleSidebar} />
			<div className='flex flex-1'>
				<Sidebar isOpen={isSidebarOpen || isDesktop} onClose={handleCloseSidebar} />
				<FloatingButton />
				<div className='flex-1 flex justify-center'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}
