// ============================================
// FlightCard.jsx — Single Flight Card Component
// ============================================
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { formatPrice, formatDuration } from '../../utils/validators'
import styles from './FlightCard.module.css'

function formatTime(isoString) {
  if (!isoString) return '--:--'
  return new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

function DetailRow({ icon, label, value, highlight }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailIcon}>{icon}</span>
      <span className={styles.detailLabel}>{label}</span>
      <span className={`${styles.detailValue} ${highlight ? styles.detailHighlight : ''}`}>{value}</span>
    </div>
  )
}

// Fiyat analiz skalası
function PriceScale({ price }) {
  const level = price < 2000 ? 'cheap' : price < 4000 ? 'medium' : 'expensive'
  const labels = { cheap: '✅ Ucuz', medium: '🟡 Ortalama', expensive: '🔴 Pahalı' }
  const widths  = { cheap: '25%', medium: '60%', expensive: '90%' }
  const colors  = { cheap: '#22c55e', medium: '#eab308', expensive: '#ef4444' }
  return (
    <div className={styles.priceScale}>
      <span className={styles.priceScaleLabel}>{labels[level]}</span>
      <div className={styles.priceScaleBar}>
        <div
          className={styles.priceScaleFill}
          style={{ width: widths[level], background: colors[level] }}
        />
      </div>
    </div>
  )
}

// Durum badge
function StatusBadge({ status }) {
  const map = {
    ontime:   { label: '🟢 Zamanında',      cls: styles.badgeGreen  },
    delayed:  { label: '🔴 Rötarlı',         cls: styles.badgeRed    },
    boarding: { label: '🟡 Biniş Başladı',   cls: styles.badgeYellow },
    departed: { label: '✈️ Kalktı',           cls: styles.badgeBlue   },
    landed:   { label: '🛬 İndi',            cls: styles.badgeGreen  },
  }
  const s = map[status] || map['ontime']
  return <span className={`${styles.statusBadge} ${s.cls}`}>{s.label}</span>
}

export default function FlightCard({ flight }) {
  const { addTracked, removeTracked, isTracked } = useAppContext()
  const tracked  = isTracked(flight.id)
  const [expanded, setExpanded] = useState(false)

  function handleTrackToggle() {
    tracked ? removeTracked(flight.id) : addTracked(flight)
  }

  return (
    <div className={`${styles.card} fade-in ${tracked ? styles.cardTracked : ''} ${expanded ? styles.cardExpanded : ''}`}>

      {/* Header */}
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

        <div className={styles.headerRight}>
          <StatusBadge status={flight.status || 'ontime'} />
          <div className={styles.price}>
            <span className={styles.priceAmount}>{formatPrice(flight.price, flight.currency)}</span>
            <span className={styles.priceLabel}>kişi başı</span>
          </div>
        </div>
      </div>

      {/* Rota */}
      <div className={styles.route}>
        <div className={styles.routePoint}>
          <span className={styles.routeCode}>{flight.origin}</span>
          <span className={styles.routeTime}>{formatTime(flight.departureTime)}</span>
          <span className={styles.routeCity}>{flight.originCity}</span>
        </div>
        <div className={styles.routeLine}>
          <div className={styles.routeDuration}>{formatDuration(flight.durationMinutes)}</div>
          <div className={styles.routeBar}>
            <div className={styles.routeBarLine} />
            <span className={styles.routePlane}>✈</span>
          </div>
          <div className={styles.routeStops}>{flight.stops === 0 ? 'Direkt' : `${flight.stops} aktarma`}</div>
        </div>
        <div className={`${styles.routePoint} ${styles.routePointRight}`}>
          <span className={styles.routeCode}>{flight.destination}</span>
          <span className={styles.routeTime}>{formatTime(flight.arrivalTime)}</span>
          <span className={styles.routeCity}>{flight.destinationCity}</span>
        </div>
      </div>

      {/* Fiyat skalası */}
      <PriceScale price={flight.price} />

      {/* Detay paneli */}
      <div className={`${styles.details} ${expanded ? styles.detailsOpen : ''}`} aria-hidden={!expanded}>
        <div className={styles.detailsInner}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>Uçuş Bilgisi</p>
              <DetailRow icon="✈" label="Uçuş no"   value={flight.flightNumber} />
              <DetailRow icon="⏱" label="Süre"      value={formatDuration(flight.durationMinutes)} />
              <DetailRow icon="🛫" label="Kalkış"    value={formatTime(flight.departureTime)} />
              <DetailRow icon="🛬" label="Varış"     value={formatTime(flight.arrivalTime)} />
              <DetailRow icon="🔁" label="Aktarma"   value={flight.stops === 0 ? 'Direkt' : `${flight.stops} aktarma`} highlight={flight.stops === 0} />
            </div>
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>Bagaj Hakkı</p>
              <DetailRow icon="🎒" label="Kabin"      value="1 × 8 kg" />
              <DetailRow icon="🧳" label="Kabin üstü" value="Dahil değil" />
              <DetailRow icon="📦" label="Ücretli"    value="₺350'den başlar" />
            </div>
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>Esneklik</p>
              <DetailRow icon="❌" label="İptal"      value="Geri ödemesiz" />
              <DetailRow icon="🔄" label="Değişiklik" value="₺200 ücretle" />
              <DetailRow icon="💺" label="Koltuk seç" value="Ücretli" />
              <DetailRow icon="🍽" label="Yemek"      value="Dahil değil" />
            </div>
          </div>
          <p className={styles.detailsNote}>* Bilgiler havayoluna göre değişebilir.</p>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          {flight.stops === 0 && <span className={styles.tagDirect}>Direkt Uçuş</span>}
          <button
            className={styles.expandBtn}
            onClick={() => setExpanded(prev => !prev)}
            aria-expanded={expanded}
          >
            <span>{expanded ? 'Detayları Gizle' : 'Detayları Gör'}</span>
            <span className={`${styles.expandChevron} ${expanded ? styles.chevronUp : ''}`}>▾</span>
          </button>
        </div>
        <button
          className={`${styles.trackBtn} ${tracked ? styles.trackBtnActive : ''}`}
          onClick={handleTrackToggle}
        >
          {tracked ? <><span>✔</span> Takipte</> : <><span>+</span> Takip Et</>}
        </button>
      </div>

    </div>
  )
}