import { Navigate, useLocation } from 'react-router'
import { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Layout } from './Layout'

const ProtectedLayout = () => {
	const { accessToken } = useAuth()
	const location = useLocation()
	const hasAlertedRef = useRef(false)

	useEffect(() => {
		if (!accessToken && !location.state?.from && !hasAlertedRef.current) {
			alert('로그인이 필요한 서비스입니다.')
			hasAlertedRef.current = true
		}
	}, [accessToken, location.state])

	if (!accessToken) {
		return <Navigate to='/login' replace state={{ from: location }} />
	}

	return (
		<>
			<Layout />
		</>
	)
}

export default ProtectedLayout
