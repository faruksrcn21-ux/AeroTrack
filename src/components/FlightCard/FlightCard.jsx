// ============================================
// FlightCard.jsx — Single Flight Card Component
// Props: flight (object)
// ============================================
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { formatPrice, formatDuration } from '../../utils/validators'
import styles from './FlightCard.module.css'

// Time format: "08:30"
function formatTime(isoString) {
  if (!isoString) return '--:--'
  return new Date(isoString).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Detail row — icon + label + value
function DetailRow({ icon, label, value, highlight }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailIcon} aria-hidden="true">{icon}</span>
      <span className={styles.detailLabel}>{label}</span>
      <span className={`${styles.detailValue} ${highlight ? styles.detailHighlight : ''}`}>
        {value}
      </span>
    </div>
  )
}

export default function FlightCard({ flight }) {
  // Get state functions from context
  const { addTracked, removeTracked, isTracked } = useAppContext()
  const tracked = isTracked(flight.id)

  // Expand/collapse local state
  const [expanded, setExpanded] = useState(false)

  function handleTrackToggle() {
    if (tracked) {
      removeTracked(flight.id)
    } else {
      addTracked(flight)
    }
  }

  return (
    <div className={`${styles.card} fade-in ${tracked ? styles.cardTracked : ''} ${expanded ? styles.cardExpanded : ''}`}>

      {/* Havayolu başlığı */}
      <div className={styles.header}>
        <div className={styles.airline}>
          <div className={styles.airlineLogo}>
            {flight.airlineLogo
              ? <img src={flight.airlineLogo} alt={flight.airline} />
              : <span className={styles.airlineInitial}>{flight.airline[0]}</span>
            }
          </div>
          <div>
            <div className={styles.airlineName}>{flight.airline}</div>
            <div className={styles.flightNumber}>{flight.flightNumber}</div>
          </div>
        </div>

        <div className={styles.price}>
          <span className={styles.priceAmount}>
            {formatPrice(flight.price, flight.currency)}
          </span>
          <span className={styles.priceLabel}>kişi başı</span>
        </div>
      </div>

      {/* Rota — kalkış, süre, varış */}
      <div className={styles.route}>
        <div className={styles.routePoint}>
          <span className={styles.routeCode}>{flight.origin}</span>
          <span className={styles.routeTime}>{formatTime(flight.departureTime)}</span>
          <span className={styles.routeCity}>{flight.originCity}</span>
        </div>

        <div className={styles.routeLine}>
          <div className={styles.routeDuration}>
            {formatDuration(flight.durationMinutes)}
          </div>
          <div className={styles.routeBar}>
            <div className={styles.routeBarLine} />
            <span className={styles.routePlane}>✈</span>
          </div>
          <div className={styles.routeStops}>
            {flight.stops === 0 ? 'Direkt' : `${flight.stops} aktarma`}
          </div>
        </div>

        <div className={`${styles.routePoint} ${styles.routePointRight}`}>
          <span className={styles.routeCode}>{flight.destination}</span>
          <span className={styles.routeTime}>{formatTime(flight.arrivalTime)}</span>
          <span className={styles.routeCity}>{flight.destinationCity}</span>
        </div>
      </div>

      {/* ── Expandable Detay Paneli (Öğrenci 1) ── */}
      <div
        className={`${styles.details} ${expanded ? styles.detailsOpen : ''}`}
        aria-hidden={!expanded}
      >
        <div className={styles.detailsInner}>

          {/* 3 kolon: Uçuş Bilgisi / Bagaj / Esneklik */}
          <div className={styles.detailsGrid}>

            {/* Kolon 1 — Uçuş detayları */}
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>Uçuş Bilgisi</p>
              <DetailRow icon="✈" label="Uçuş no"    value={flight.flightNumber} />
              <DetailRow icon="⏱" label="Süre"       value={formatDuration(flight.durationMinutes)} />
              <DetailRow icon="🛫" label="Kalkış"     value={formatTime(flight.departureTime)} />
              <DetailRow icon="🛬" label="Varış"      value={formatTime(flight.arrivalTime)} />
              <DetailRow
                icon="🔁"
                label="Aktarma"
                value={flight.stops === 0 ? 'Direkt' : `${flight.stops} aktarma`}
                highlight={flight.stops === 0}
              />
            </div>

            {/* Kolon 2 — Bagaj */}
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>Bagaj Hakkı</p>
              <DetailRow icon="🎒" label="Kabin"      value="1 × 8 kg" />
              <DetailRow icon="🧳" label="Kabin üstü" value="Dahil değil" />
              <DetailRow icon="📦" label="Ücretli"    value="₺350'den başlar" />
            </div>

            {/* Kolon 3 — İptal & Değişiklik */}
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>Esneklik</p>
              <DetailRow icon="❌" label="İptal"       value="Geri ödemesiz" />
              <DetailRow icon="🔄" label="Değişiklik"  value="₺200 ücretle" />
              <DetailRow icon="💺" label="Koltuk seç"  value="Ücretli" />
              <DetailRow icon="🍽" label="Yemek"       value="Dahil değil" />
            </div>

          </div>

          {/* Alt bilgi notu */}
          <p className={styles.detailsNote}>
            * Bagaj ve esneklik bilgileri havayoluna göre değişebilir. Kesin bilgi için havayolunu kontrol edin.
          </p>

        </div>
      </div>

      {/* Footer — detay toggle + takip butonu */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          {flight.stops === 0 && (
            <span className={styles.tagDirect}>Direkt Uçuş</span>
          )}

          {/* Detay aç/kapat butonu */}
          <button
            className={styles.expandBtn}
            onClick={() => setExpanded(prev => !prev)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Detayları gizle' : 'Detayları göster'}
          >
            <span>{expanded ? 'Detayları Gizle' : 'Detayları Gör'}</span>
            <span className={`${styles.expandChevron} ${expanded ? styles.chevronUp : ''}`}>
              ▾
            </span>
          </button>
        </div>

        <button
          className={`${styles.trackBtn} ${tracked ? styles.trackBtnActive : ''}`}
          onClick={handleTrackToggle}
          aria-label={tracked ? 'Takipten çıkar' : 'Takibe al'}
        >
          {tracked ? (
            <><span>✓</span> Takipte</>
          ) : (
            <><span>+</span> Takip Et</>
          )}
        </button>
      </div>

    </div>
  )
}

