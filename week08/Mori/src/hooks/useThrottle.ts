import { useEffect, useRef, useState } from "react"

function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecutedRef = useRef<number>(Date.now())
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecutedRef.current

    if (timeSinceLastExecution >= interval) {
      setThrottledValue(value)
      lastExecutedRef.current = now
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    } else {
      const remainingTime = interval - timeSinceLastExecution
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        setThrottledValue(value)
        lastExecutedRef.current = Date.now()
        timeoutRef.current = null
      }, remainingTime)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [value, interval])

  return throttledValue
}

export default useThrottle

