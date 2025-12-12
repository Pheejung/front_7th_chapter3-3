import { useCallback, useEffect, useState } from "react"
import Toast, { ToastItem } from "./Toast"

/**
 * ToastProvider listens to global `api:error` CustomEvent and shows a toast message.
 * The `apiClient` dispatches this event with detail: { message: string }
 */
export default function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    setToasts((s) => [...s, { id, message }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    function handler(ev: Event) {
      try {
        const e = ev as CustomEvent<{ message?: string }>
        addToast(e.detail?.message || "알 수 없는 오류가 발생했습니다")
      } catch (err) {
        addToast("알 수 없는 API 오류")
      }
    }
    window.addEventListener("api:error", handler as EventListener)
    return () => window.removeEventListener("api:error", handler as EventListener)
  }, [addToast])

  return <Toast toasts={toasts} onRemove={removeToast} />
}

export { default as ToastProvider } from "./Toast"
