import { Outlet } from 'react-router'
import { useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { FloatingButton } from '../FloatingButton'

export const Layout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [isDesktop, setIsDesktop] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 1024)
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

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
			<Navbar onMenuClick={handleToggleSidebar} />
			<div className='flex flex-1'>
				<Sidebar isOpen={isSidebarOpen || isDesktop} onClose={handleCloseSidebar} />
				<FloatingButton />
				<div className='flex-1 flex justify-center items-center'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}
