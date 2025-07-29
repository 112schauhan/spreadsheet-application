/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useCallback } from "react"

export function useDebounce<T extends (...args: any[]) => void>(
  fn: T,
  wait: number
) {
  const timeout = useRef<any>(null)
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => fn(...args), wait)
    },
    [fn, wait]
  )
}

export function useThrottle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
) {
  const lastFunc = useRef<number>(0)
  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastFunc.current > limit) {
        fn(...args)
        lastFunc.current = now
      }
    },
    [fn, limit]
  )
}

const usePerformanceOptimization = { useDebounce, useThrottle }
export default usePerformanceOptimization
