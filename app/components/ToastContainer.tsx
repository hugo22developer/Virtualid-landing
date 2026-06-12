'use client'
import { useToast } from '../context/ToastContext'

const iconMap: Record<string, string> = { success: '✅', error: '❌', info: '💡', warning: '⚠️' }

export default function ToastContainer() {
  const { toasts, dismissToast } = useToast()
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}${t.show ? ' show' : ''}`}>
          <div className="toast-icon">{iconMap[t.type] ?? 'ℹ️'}</div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            <div className="toast-msg">{t.msg}</div>
          </div>
          <button className="toast-close" onClick={() => dismissToast(t)}>×</button>
          <div className="toast-progress"><div className="toast-progress-bar" /></div>
        </div>
      ))}
    </div>
  )
}