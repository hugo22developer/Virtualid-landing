'use client'
import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: number
  type: ToastType
  title: string
  msg: string
  show: boolean
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, msg: string) => void
  toasts: Toast[]
  dismissToast: (t: Toast) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const dismissToast = useCallback((t: Toast) => {
    setToasts(prev => prev.map(x => x.id === t.id ? { ...x, show: false } : x))
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 350)
  }, [])

  const showToast = useCallback((type: ToastType, title: string, msg: string) => {
    const id = idRef.current++
    const t: Toast = { id, type, title, msg, show: false }
    setToasts(prev => [...prev, t])
    requestAnimationFrame(() => {
      setToasts(prev => prev.map(x => x.id === id ? { ...x, show: true } : x))
    })
    setTimeout(() => dismissToast(t), 4500)
  }, [dismissToast])

  return (
    <ToastContext.Provider value={{ showToast, toasts, dismissToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}