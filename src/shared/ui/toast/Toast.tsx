import { useEffect } from "react"

export interface ToastItem {
  id: string
  message: string
}

interface Props {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

export default function Toast({ toasts, onRemove }: Props) {
  useEffect(() => {
    const timers = toasts.map((t) => {
      const id = setTimeout(() => onRemove(t.id), 5000)
      return id
    })
    return () => timers.forEach((t) => clearTimeout(t))
  }, [toasts, onRemove])

  if (!toasts.length) return null

  return (
    <div className="fixed right-4 bottom-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className="bg-gray-900 text-white px-4 py-2 rounded shadow-md max-w-sm"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
