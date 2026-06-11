// ============================================
// Toast.jsx — Bildirim Bileşeni
// Öğrenci 1 sorumluluğu (UI & animasyon)
// Öğrenci 3: useToast hook'u ile beslenir
// ============================================
import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

// İkon haritası — her type için ayrı sembol
const ICONS = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

// --- Tek Toast --- //
function Toast({ id, message, type = 'info', duration = 3000, onRemove }) {
  const [visible, setVisible] = useState(false)   // mount sonrası slide-in
  const [leaving, setLeaving] = useState(false)   // slide-out öncesi

  // Mount → kısa gecikme → görünür yap (CSS transition tetiklensin)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  // Çıkış animasyonu: önce leaving=true (slide-out), sonra kaldır
  function handleRemove() {
    setLeaving(true)
    setTimeout(() => onRemove(id), 280)
  }

  // Progress bar'ın bitmesiyle de tetiklenebilir
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
      {/* Sol renk çubuğu */}
      <span className={styles.bar} />

      {/* İkon */}
      <span className={styles.icon} aria-hidden="true">
        {ICONS[type]}
      </span>

      {/* Mesaj */}
      <p className={styles.message}>{message}</p>

      {/* Kapat butonu */}
      <button
        className={styles.close}
        onClick={handleRemove}
        aria-label="Bildirimi kapat"
      >
        ✕
      </button>

      {/* Progress bar — süre dolunca daralır */}
      <div
        className={styles.progress}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

// --- Toast Container — sağ üste sabitlenmiş liste --- //
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
