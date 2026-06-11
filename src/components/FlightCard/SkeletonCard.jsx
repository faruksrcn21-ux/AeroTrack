// ============================================
// SkeletonCard.jsx — Yükleme Placeholder Kartı
// Öğrenci 1 sorumluluğu
// FlightCard ile birebir aynı layout,
// içerik yerine animasyonlu placeholder'lar
// ============================================
import styles from './SkeletonCard.module.css'

export default function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">

      {/* Header — havayolu logo + isim + fiyat */}
      <div className={styles.header}>
        <div className={styles.airline}>
          {/* Logo placeholder */}
          <div className={`${styles.bone} ${styles.logo}`} />
          <div className={styles.airlineTexts}>
            <div className={`${styles.bone} ${styles.airlineName}`} />
            <div className={`${styles.bone} ${styles.flightNum}`} />
          </div>
        </div>
        <div className={styles.priceGroup}>
          <div className={`${styles.bone} ${styles.price}`} />
          <div className={`${styles.bone} ${styles.priceLabel}`} />
        </div>
      </div>

      {/* Rota — kalkış / çizgi / varış */}
      <div className={styles.route}>
        {/* Sol — kalkış */}
        <div className={styles.routePoint}>
          <div className={`${styles.bone} ${styles.routeCode}`} />
          <div className={`${styles.bone} ${styles.routeTime}`} />
          <div className={`${styles.bone} ${styles.routeCity}`} />
        </div>

        {/* Orta — süre çizgisi */}
        <div className={styles.routeMiddle}>
          <div className={`${styles.bone} ${styles.duration}`} />
          <div className={`${styles.bone} ${styles.line}`} />
          <div className={`${styles.bone} ${styles.stops}`} />
        </div>

        {/* Sağ — varış */}
        <div className={`${styles.routePoint} ${styles.routeRight}`}>
          <div className={`${styles.bone} ${styles.routeCode}`} />
          <div className={`${styles.bone} ${styles.routeTime}`} />
          <div className={`${styles.bone} ${styles.routeCity}`} />
        </div>
      </div>

      {/* Footer — tag + buton */}
      <div className={styles.footer}>
        <div className={`${styles.bone} ${styles.tag}`} />
        <div className={`${styles.bone} ${styles.btn}`} />
      </div>

    </div>
  )
}

// SkeletonList: App.jsx'te kullanım kolaylığı için
// count kadar SkeletonCard render eder
export function SkeletonList({ count = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
