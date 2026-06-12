// ============================================
// FlightCard.jsx — Single Flight Card Component
// ============================================
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'
import { formatPrice, formatDuration, convertCurrency } from '../../utils/validators'
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
function PriceScale({ price, lang }) {
  const level = price < 2000 ? 'cheap' : price < 4000 ? 'medium' : 'expensive'
  const labels = {
    cheap: lang === 'tr' ? '✅ Ucuz' : '✅ Cheap',
    medium: lang === 'tr' ? '🟡 Ortalama' : '🟡 Average',
    expensive: lang === 'tr' ? '🔴 Pahalı' : '🔴 Expensive'
  }
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
function StatusBadge({ status, lang }) {
  const map = {
    ontime:   { label: lang === 'tr' ? '🟢 Zamanında' : '🟢 On-Time',      cls: styles.badgeGreen  },
    delayed:  { label: lang === 'tr' ? '🔴 Rötarlı' : '🔴 Delayed',         cls: styles.badgeRed    },
    boarding: { label: lang === 'tr' ? '🟡 Biniş Başladı' : '🟡 Boarding',   cls: styles.badgeYellow },
    departed: { label: lang === 'tr' ? '✈️ Kalktı' : '✈️ Departed',           cls: styles.badgeBlue   },
    landed:   { label: lang === 'tr' ? '🛬 İndi' : '🛬 Landed',            cls: styles.badgeGreen  },
  }
  const s = map[status] || map['ontime']
  return <span className={`${styles.statusBadge} ${s.cls}`}>{s.label}</span>
}

export default function FlightCard({ flight, onBuyClick }) {
  const { addTracked, removeTracked, isTracked } = useAppContext()
  const { t, lang } = useLanguage()
  const { currency } = useCurrency()

  const tracked  = isTracked(flight.id)
  const [expanded, setExpanded] = useState(false)

  // Convert price if flight currency doesn't match target currency (e.g. in mock mode)
  const displayPrice = flight.currency === currency 
    ? flight.price 
    : convertCurrency(flight.price, currency)

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
          <StatusBadge status={flight.status || 'ontime'} lang={lang} />
          <div className={styles.price}>
            <span className={styles.priceAmount}>{formatPrice(displayPrice, currency, lang)}</span>
            <span className={styles.priceLabel}>{t('perPerson')}</span>
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
          <div className={styles.routeDuration}>{formatDuration(flight.durationMinutes, lang)}</div>
          <div className={styles.routeBar}>
            <div className={styles.routeBarLine} />
            <span className={styles.routePlane}>✈</span>
          </div>
          <div className={styles.routeStops}>{flight.stops === 0 ? t('direct') : `${flight.stops} ${t('stops')}`}</div>
        </div>
        <div className={`${styles.routePoint} ${styles.routePointRight}`}>
          <span className={styles.routeCode}>{flight.destination}</span>
          <span className={styles.routeTime}>{formatTime(flight.arrivalTime)}</span>
          <span className={styles.routeCity}>{flight.destinationCity}</span>
        </div>
      </div>

      {/* Fiyat skalası */}
      <PriceScale price={flight.price} lang={lang} />

      {/* Detay paneli */}
      <div className={`${styles.details} ${expanded ? styles.detailsOpen : ''}`} aria-hidden={!expanded}>
        <div className={styles.detailsInner}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>{t('flightInfo')}</p>
              <DetailRow icon="✈" label={t('flightNo')}   value={flight.flightNumber} />
              <DetailRow icon="⏱" label={t('duration')}      value={formatDuration(flight.durationMinutes, lang)} />
              <DetailRow icon="🛫" label={t('departure')}    value={formatTime(flight.departureTime)} />
              <DetailRow icon="🛬" label={t('arrival')}     value={formatTime(flight.arrivalTime)} />
              <DetailRow icon="🔁" label={t('transfer')}   value={flight.stops === 0 ? t('direct') : `${flight.stops} ${t('stops')}`} highlight={flight.stops === 0} />
            </div>
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>{t('baggage')}</p>
              <DetailRow icon="🎒" label={t('cabin')}      value="1 × 8 kg" />
              <DetailRow icon="🧳" label={t('cabinAbove')} value={t('notIncluded')} />
              <DetailRow icon="📦" label={t('paid')}    value={currency === 'TRY' ? "₺350'den başlar" : currency === 'USD' ? "$10 from" : "€9 from"} />
            </div>
            <div className={styles.detailsCol}>
              <p className={styles.detailsColTitle}>{t('flexibility')}</p>
              <DetailRow icon="❌" label={t('cancel')}      value={t('noRefund')} />
              <DetailRow icon="🔄" label={t('change')} value={currency === 'TRY' ? "₺200 ücretle" : currency === 'USD' ? "With $6 fee" : "With €5 fee"} />
              <DetailRow icon="💺" label={t('seatSelect')} value={t('paid')} />
              <DetailRow icon="🍽" label={t('meal')}      value={t('notIncluded')} />
            </div>
          </div>
          <p className={styles.detailsNote}>{t('baggageNote')}</p>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          {flight.stops === 0 && <span className={styles.tagDirect}>{t('directFlight')}</span>}
          <button
            className={styles.expandBtn}
            onClick={() => setExpanded(prev => !prev)}
            aria-expanded={expanded}
          >
            <span>{expanded ? t('hideDetails') : t('showDetails')}</span>
            <span className={`${styles.expandChevron} ${expanded ? styles.chevronUp : ''}`}>▾</span>
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={styles.buyBtn}
            onClick={() => onBuyClick && onBuyClick(flight)}
          >
            🎫 {t('buyTicket')}
          </button>
          <button
            className={`${styles.trackBtn} ${tracked ? styles.trackBtnActive : ''}`}
            onClick={handleTrackToggle}
          >
            {tracked ? <><span>✔</span> {t('tracking')}</> : <><span>+</span> {t('trackFlight')}</>}
          </button>
        </div>
      </div>

    </div>
  )
}