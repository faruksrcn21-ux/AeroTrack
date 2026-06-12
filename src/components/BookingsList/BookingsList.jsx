// ============================================
// BookingsList.jsx — Biletlerim Paneli
// Satın alınan biletlerin biniş kartı görünümü
// Öğrenci 3 entegrasyonu
// ============================================
import { useAppContext } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'
import { formatPrice, convertCurrency } from '../../utils/validators'
import styles from './BookingsList.module.css'

// Gelişmiş QR kod simülasyonu (21x21 hücreli ve köşelerde gerçekçi algılama desenleri ile)
function MockQR({ seed }) {
  const cells = []
  let hash = 0
  for (let i = 0; i < (seed || 'x').length; i++) {
    hash = ((hash << 5) - hash + (seed || 'x').charCodeAt(i)) | 0
  }
  
  const gridSize = 21 // 21x21 Version 1 QR
  const totalCells = gridSize * gridSize

  for (let i = 0; i < totalCells; i++) {
    const row = Math.floor(i / gridSize)
    const col = i % gridSize
    
    let isDark = false
    
    // Sol Üst Köşe (Top-Left Finder)
    if (row < 7 && col < 7) {
      isDark = (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4))
    }
    // Sağ Üst Köşe (Top-Right Finder)
    else if (row < 7 && col >= 14) {
      const c = col - 14
      isDark = (row === 0 || row === 6 || c === 0 || c === 6 || (row >= 2 && row <= 4 && c >= 2 && c <= 4))
    }
    // Sol Alt Köşe (Bottom-Left Finder)
    else if (row >= 14 && col < 7) {
      const r = row - 14
      isDark = (r === 0 || r === 6 || col === 0 || col === 6 || (r >= 2 && r <= 4 && col >= 2 && col <= 4))
    }
    // Diğer alanlar: Pseudo-random veri hücreleri
    else {
      isDark = Math.abs((hash * (i + 13) * 7919) % 100) > 48
    }

    cells.push(
      <div
        key={i}
        className={styles.qrCell}
        style={{ background: isDark ? '#000' : '#fff' }}
      />
    )
  }

  return <div className={styles.qrCode}>{cells}</div>
}

function formatTime(isoString) {
  if (!isoString) return '--:--'
  return new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoString, lang) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export default function BookingsList() {
  const { bookings, cancelBooking } = useAppContext()
  const { t, lang } = useLanguage()
  const { currency } = useCurrency()

  if (!bookings || bookings.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2 className={styles.title}>🎫 {t('myBookings')}</h2>
            <span className={styles.count}>{bookings.length}</span>
          </div>
        </div>

        <div className={styles.list}>
          {bookings.map((booking, index) => {
            const fl = booking.flight
            const displayPrice = fl.currency === currency
              ? fl.price
              : convertCurrency(fl.price, currency)

            return (
              <div key={booking.id} className={`${styles.pass} fade-in`} style={{ animationDelay: `${index * 0.08}s` }}>

                {/* Üst: Rota + Fiyat */}
                <div className={styles.passTop}>
                  <div className={styles.passRoute}>
                    <span className={styles.passCode}>{fl.origin}</span>
                    <div className={styles.passArrow}>
                      <span className={styles.passAirline}>{fl.airline} {fl.flightNumber}</span>
                      <span className={styles.passArrowLine}>✈ ────→</span>
                    </div>
                    <span className={styles.passCode}>{fl.destination}</span>
                  </div>
                  <div className={styles.passRight}>
                    <div className={styles.passPrice}>{formatPrice(displayPrice, currency, lang)}</div>
                    <div className={styles.passStatus}>
                      <span>●</span>
                      {booking.status === 'confirmed'
                        ? (lang === 'tr' ? 'Onaylandı' : 'Confirmed')
                        : (lang === 'tr' ? 'İptal Edildi' : 'Cancelled')
                      }
                    </div>
                  </div>
                </div>

                <hr className={styles.passDivider} />

                {/* Alt: Detaylar + QR */}
                <div className={styles.passBottom}>
                  <div className={styles.passField}>
                    <span className={styles.passFieldLabel}>{t('firstName')} {t('lastName')}</span>
                    <span className={styles.passFieldValue}>
                      {booking.passenger?.firstName} {booking.passenger?.lastName}
                    </span>
                  </div>
                  <div className={styles.passField}>
                    <span className={styles.passFieldLabel}>{lang === 'tr' ? 'Koltuk' : 'Seat'}</span>
                    <span className={styles.passFieldValue}>{booking.seat || '—'}</span>
                  </div>
                  <div className={styles.passField}>
                    <span className={styles.passFieldLabel}>{lang === 'tr' ? 'Kapı' : 'Gate'}</span>
                    <span className={styles.passFieldValue}>{booking.boardingPass?.gate || '—'}</span>
                  </div>
                  <div className={styles.passField}>
                    <span className={styles.passFieldLabel}>{lang === 'tr' ? 'Tarih' : 'Date'}</span>
                    <span className={styles.passFieldValue}>{formatDate(booking.purchasedAt, lang)}</span>
                  </div>
                  <div className={styles.passQR}>
                    <MockQR seed={booking.id} />
                  </div>
                </div>

                {/* İptal butonu */}
                {booking.status === 'confirmed' && (
                  <div className={styles.passActions}>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => cancelBooking(booking.id)}
                    >
                      ✕ {lang === 'tr' ? 'İptal Et' : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
