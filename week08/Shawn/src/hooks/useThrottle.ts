import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * useThrottle 훅
 * 값이나 콜백 함수를 일정 주기마다 한 번만 실행되도록 제어합니다.
 *
 * @param value - 스로틀링할 값
 * @param interval - 스로틀링 간격 (밀리초)
 * @returns 스로틀링된 값
 */
export const useThrottle = <T>(value: T, interval: number): T => {
	const [throttledValue, setThrottledValue] = useState<T>(value)
	const lastExecutedRef = useRef<number>(Date.now())
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		const now = Date.now()
		const timeSinceLastExecution = now - lastExecutedRef.current

		// 이전 실행으로부터 interval 시간이 지났다면 즉시 실행
		if (timeSinceLastExecution >= interval) {
			setThrottledValue(value)
			lastExecutedRef.current = now
			// 기존 타이머가 있다면 정리
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
				timeoutRef.current = null
			}
		} else {
			// 아직 interval 시간이 지나지 않았다면 남은 시간 후에 실행
			const remainingTime = interval - timeSinceLastExecution

			// 기존 타이머가 있다면 정리
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			timeoutRef.current = setTimeout(() => {
				setThrottledValue(value)
				lastExecutedRef.current = Date.now()
				timeoutRef.current = null
			}, remainingTime)
		}

		// 언마운트 또는 의존성 변경 시 타이머 정리
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
				timeoutRef.current = null
			}
		}
	}, [value, interval])

	return throttledValue
}

/**
 * useThrottleCallback 훅
 * 콜백 함수를 일정 주기마다 한 번만 실행되도록 제어합니다.
 *
 * @param callback - 스로틀링할 콜백 함수
 * @param interval - 스로틀링 간격 (밀리초)
 * @param deps - 콜백 함수의 의존성 배열
 * @returns 스로틀링된 콜백 함수
 */
export const useThrottleCallback = <T extends (...args: unknown[]) => unknown>(
	callback: T,
	interval: number,
	deps: React.DependencyList = []
): T => {
	const lastExecutedRef = useRef<number>(0)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const callbackRef = useRef(callback)

	// 콜백 함수가 변경될 때마다 ref 업데이트
	useEffect(() => {
		callbackRef.current = callback
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [callback, ...deps])

	const throttledCallback = useCallback(
		((...args: Parameters<T>) => {
			const now = Date.now()
			const timeSinceLastExecution = now - lastExecutedRef.current

			// 이전 실행으로부터 interval 시간이 지났다면 즉시 실행
			if (timeSinceLastExecution >= interval) {
				callbackRef.current(...args)
				lastExecutedRef.current = now
				// 기존 타이머가 있다면 정리
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current)
					timeoutRef.current = null
				}
			} else {
				// 아직 interval 시간이 지나지 않았다면 남은 시간 후에 실행
				const remainingTime = interval - timeSinceLastExecution

				// 기존 타이머가 있다면 정리
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current)
				}

				timeoutRef.current = setTimeout(() => {
					callbackRef.current(...args)
					lastExecutedRef.current = Date.now()
					timeoutRef.current = null
				}, remainingTime)
			}
		}) as T,
		[interval]
	)

	// 언마운트 시 타이머 정리
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
				timeoutRef.current = null
			}
		}
	}, [])

	return throttledCallback
}

