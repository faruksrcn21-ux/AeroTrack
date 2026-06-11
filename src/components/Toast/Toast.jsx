// ============================================
// Toast.jsx — Notification Component
// ============================================
import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

// Icon map — different symbol for each type
const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

// --- Single Toast --- //
function Toast({ id, message, type = 'info', duration = 3000, onRemove }) {
  const [visible, setVisible] = useState(false)   // slide-in after mount
  const [leaving, setLeaving] = useState(false)   // before slide-out

  // Mount → short delay → make visible (trigger CSS transition)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  // Exit animation: set leaving=true (slide-out), then remove
  function handleRemove() {
    setLeaving(true)
    setTimeout(() => onRemove(id), 280)
  }

  // Can also be triggered when progress bar completes
  useEffect(() => {
    const t = setTimeout(handleRemove, duration - 300) // animasyon payı
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={[
        styles.toast,
        styles[type],
        visible  ? styles.visible  : '',
        leaving  ? styles.leaving  : '',
      ].join(' ')}
      role="alert"
      aria-live="polite"
    >
      {/* Left color bar */}
      <span className={styles.bar} />

      {/* Icon */}
      <span className={styles.icon} aria-hidden="true">
        {ICONS[type]}
      </span>

      {/* Message */}
      <p className={styles.message}>{message}</p>

      {/* Close button */}
      <button
        className={styles.close}
        onClick={handleRemove}
        aria-label="Close notification"
      >
        ✕
      </button>

      {/* Progress bar — shrinks as time runs out */}
      <div
        className={styles.progress}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

// --- Toast Container — fixed list in top-right corner --- //
export function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null

  return (
    <div className={styles.container} aria-label="Bildirimler">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  )
}
