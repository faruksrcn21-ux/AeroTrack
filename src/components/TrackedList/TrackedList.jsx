// ============================================
// TrackedList.jsx — Takip Listesi Paneli
// Öğrenci 1: UI & CSS
// Öğrenci 3: removeTracked state mantığı
// ============================================
import { useAppContext } from '../../context/AppContext'
import { formatPrice, formatDuration } from '../../utils/validators'
import styles from './TrackedList.module.css'

function formatTime(isoString) {
  if (!isoString) return '--:--'
  return new Date(isoString).toLocaleTimeString('tr-TR', {
    hour: '2-digit', minute: '2-digit',
  })
}

export default function TrackedList() {
  // Öğrenci 3: context'ten takip listesi ve removeTracked al
  const { trackedFlights, removeTracked } = useAppContext()

  // Takip yoksa bileşeni render etme
  if (trackedFlights.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container">

        {/* Başlık */}
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>Takip Ettiklerim</h2>
            <span className={styles.count}>{trackedFlights.length}</span>
          </div>
          <p className={styles.subtitle}>
            Seçtiğiniz uçuşlar — localStorage'a kaydedildi
          </p>
        </div>

        {/* Takip listesi */}
        <div className={styles.list}>
          {trackedFlights.map((flight, index) => (
            <div
              key={flight.id}
              className={`${styles.item} fade-in`}
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              {/* Sol: havayolu */}
              <div className={styles.itemAirline}>
                <div className={styles.airlineAvatar}>
                  {flight.airline[0]}
                </div>
                <div>
                  <div className={styles.airlineName}>{flight.airline}</div>
                  <div className={styles.flightNum}>{flight.flightNumber}</div>
                </div>
              </div>

              {/* Orta: rota */}
              <div className={styles.itemRoute}>
                <span className={styles.routeCode}>{flight.origin}</span>
                <div className={styles.routeArrow}>
                  <span className={styles.routeTime}>{formatTime(flight.departureTime)}</span>
                  <span className={styles.routeArrowLine}>→</span>
                  <span className={styles.routeTime}>{formatTime(flight.arrivalTime)}</span>
                </div>
                <span className={styles.routeCode}>{flight.destination}</span>
              </div>

              {/* Sağ: süre & fiyat & sil butonu */}
              <div className={styles.itemMeta}>
                <span className={styles.duration}>
                  {formatDuration(flight.durationMinutes)}
                </span>
                <span className={styles.price}>
                  {formatPrice(flight.price, flight.currency)}
                </span>
              </div>

              {/* Silme butonu — Öğrenci 3: removeTracked */}
              <button
                className={styles.removeBtn}
                onClick={() => removeTracked(flight.id)}
                aria-label={`${flight.airline} ${flight.flightNumber} uçuşunu takipten çıkar`}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
