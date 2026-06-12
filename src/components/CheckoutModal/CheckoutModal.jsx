// ============================================
// CheckoutModal.jsx — Koltuk Seçimi & Ödeme Modalı
// Öğrenci 3 entegrasyonu
// ============================================
import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'
import { formatPrice, convertCurrency, validateTCKimlik, validateCreditCard, validateCardExpiry, validateCVV, validatePassengerName } from '../../utils/validators'
import styles from './CheckoutModal.module.css'

// Koltuk haritası üreteci
function generateSeatMap() {
  const rows = 12
  const cols = ['A', 'B', 'C', 'D', 'E', 'F']
  const seats = []
  for (let r = 1; r <= rows; r++) {
    const row = cols.map(c => ({
      id: `${r}${c}`,
      row: r,
      col: c,
      taken: Math.random() < 0.3, // %30 dolu
    }))
    seats.push(row)
  }
  return seats
}

export default function CheckoutModal({ flight, onClose, onPurchase }) {
  const { t, lang } = useLanguage()
  const { currency } = useCurrency()

  const [step, setStep] = useState(0) // 0: koltuk, 1: yolcu, 2: ödeme
  const [seatMap] = useState(generateSeatMap)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [success, setSuccess] = useState(false)

  // Yolcu bilgileri
  const [passenger, setPassenger] = useState({
    firstName: '', lastName: '', tcNumber: ''
  })
  const [passengerErrors, setPassengerErrors] = useState({})

  // Ödeme bilgileri
  const [payment, setPayment] = useState({
    cardNumber: '', expiry: '', cvv: '', cardHolder: ''
  })
  const [paymentErrors, setPaymentErrors] = useState({})

  // ESC ile kapatma
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Fiyat hesaplama
  const displayPrice = flight.currency === currency
    ? flight.price
    : convertCurrency(flight.price, currency)

  // ── Koltuk seçimi ──
  function handleSeatClick(seat) {
    if (seat.taken) return
    setSelectedSeat(seat.id === selectedSeat ? null : seat.id)
  }

  // ── Yolcu validasyonu ──
  function validatePassengerStep() {
    const errors = {}
    const fnErr = validatePassengerName(passenger.firstName, t('firstName'))
    if (fnErr) errors.firstName = fnErr
    const lnErr = validatePassengerName(passenger.lastName, t('lastName'))
    if (lnErr) errors.lastName = lnErr
    const tcErr = validateTCKimlik(passenger.tcNumber)
    if (tcErr) errors.tcNumber = tcErr
    setPassengerErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ── Ödeme validasyonu ──
  function validatePaymentStep() {
    const errors = {}
    const cardErr = validateCreditCard(payment.cardNumber)
    if (cardErr) errors.cardNumber = cardErr
    const expErr = validateCardExpiry(payment.expiry)
    if (expErr) errors.expiry = expErr
    const cvvErr = validateCVV(payment.cvv)
    if (cvvErr) errors.cvv = cvvErr
    if (!payment.cardHolder || payment.cardHolder.trim().length < 3) {
      errors.cardHolder = lang === 'tr' ? 'Kart sahibi adı zorunludur.' : 'Card holder name is required.'
    }
    setPaymentErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ── Sonraki adım ──
  function handleNext() {
    if (step === 0) {
      if (!selectedSeat) return
      setStep(1)
    } else if (step === 1) {
      if (validatePassengerStep()) setStep(2)
    } else if (step === 2) {
      if (validatePaymentStep()) handlePurchase()
    }
  }

  // ── Satın alma ──
  function handlePurchase() {
    const bookingData = {
      flight,
      passenger,
      payment: {
        cardNumber: payment.cardNumber,
        cardHolder: payment.cardHolder
      },
      seat: selectedSeat,
    }
    onPurchase(bookingData)
    setSuccess(true)
  }

  // ── Başarı ekranı ──
  if (success) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.success}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.successTitle}>{t('bookingSuccess')}</h2>
            <p className={styles.successMsg}>
              {flight.airline} {flight.flightNumber} — {lang === 'tr' ? 'Koltuk' : 'Seat'}: {selectedSeat}
            </p>
            <button className={styles.successBtn} onClick={onClose}>
              {lang === 'tr' ? 'Tamam' : 'Done'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Uçuş özeti */}
        <div className={styles.flightSummary}>
          <div className={styles.flightRoute}>
            <span className={styles.routeCode}>{flight.origin}</span>
            <span className={styles.routeArrow}>→</span>
            <span className={styles.routeCode}>{flight.destination}</span>
          </div>
          <div className={styles.flightMeta}>
            <span>{flight.airline} {flight.flightNumber}</span>
            <span>•</span>
            <span>{formatPrice(displayPrice, currency, lang)}</span>
          </div>
        </div>

        {/* Adım göstergesi */}
        <div className={styles.steps}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`${styles.step} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
            />
          ))}
        </div>

        {/* İçerik */}
        <div className={styles.content}>

          {/* ADIM 0: Koltuk Seçimi */}
          {step === 0 && (
            <div className={styles.seatMap}>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>💺</span>
                {t('seatSelection')}
              </h3>

              <div className={styles.seatLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: 'var(--color-accent)' }} />
                  <span>{lang === 'tr' ? 'Seçili' : 'Selected'}</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
                  <span>{lang === 'tr' ? 'Boş' : 'Available'}</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: 'var(--color-surface-2)' }} />
                  <span>{lang === 'tr' ? 'Dolu' : 'Taken'}</span>
                </div>
              </div>

              <div className={styles.plane}>
                <div className={styles.seatRowLabels}>
                  <div className={styles.seatColLabel}>A</div>
                  <div className={styles.seatColLabel}>B</div>
                  <div className={styles.seatColLabel}>C</div>
                  <div className={styles.seatColLabelAisle} />
                  <div className={styles.seatColLabel}>D</div>
                  <div className={styles.seatColLabel}>E</div>
                  <div className={styles.seatColLabel}>F</div>
                </div>

                {seatMap.map((row, ri) => (
                  <div key={ri} className={styles.seatRow}>
                    <span className={styles.seatRowNum}>{ri + 1}</span>
                    {row.map((seat, ci) => (
                      <span key={seat.id}>
                        {ci === 3 && <span className={styles.seatAisle} />}
                        <button
                          className={`${styles.seat} ${seat.taken ? styles.seatTaken : ''} ${selectedSeat === seat.id ? styles.seatSelected : ''}`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.taken}
                          title={seat.id}
                        >
                          {seat.taken ? '×' : seat.id}
                        </button>
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              {selectedSeat && (
                <p style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-accent)' }}>
                  {lang === 'tr' ? 'Seçilen koltuk:' : 'Selected seat:'} <strong>{selectedSeat}</strong>
                </p>
              )}
            </div>
          )}

          {/* ADIM 1: Yolcu Bilgileri */}
          {step === 1 && (
            <>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>👤</span>
                {t('passengerInfo')}
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t('firstName')}</label>
                  <input
                    className={styles.formInput}
                    value={passenger.firstName}
                    onChange={e => setPassenger(p => ({ ...p, firstName: e.target.value }))}
                    placeholder="Ahmet"
                  />
                  {passengerErrors.firstName && <span className={styles.formError}>{passengerErrors.firstName}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t('lastName')}</label>
                  <input
                    className={styles.formInput}
                    value={passenger.lastName}
                    onChange={e => setPassenger(p => ({ ...p, lastName: e.target.value }))}
                    placeholder="Yılmaz"
                  />
                  {passengerErrors.lastName && <span className={styles.formError}>{passengerErrors.lastName}</span>}
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>{t('tcNumber')}</label>
                  <input
                    className={styles.formInput}
                    value={passenger.tcNumber}
                    onChange={e => setPassenger(p => ({ ...p, tcNumber: e.target.value.replace(/\D/g, '').slice(0, 11) }))}
                    placeholder="12345678901"
                    maxLength={11}
                  />
                  {passengerErrors.tcNumber && <span className={styles.formError}>{passengerErrors.tcNumber}</span>}
                </div>
              </div>
            </>
          )}

          {/* ADIM 2: Ödeme Bilgileri */}
          {step === 2 && (
            <>
              <h3 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>💳</span>
                {t('paymentInfo')}
              </h3>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>{t('cardNumber')}</label>
                  <input
                    className={styles.formInput}
                    value={payment.cardNumber}
                    onChange={e => setPayment(p => ({ ...p, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) }))}
                    placeholder="4111 1111 1111 1111"
                    maxLength={16}
                  />
                  {paymentErrors.cardNumber && <span className={styles.formError}>{paymentErrors.cardNumber}</span>}
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.formLabel}>{t('cardHolder')}</label>
                  <input
                    className={styles.formInput}
                    value={payment.cardHolder}
                    onChange={e => setPayment(p => ({ ...p, cardHolder: e.target.value.toUpperCase() }))}
                    placeholder="AHMET YILMAZ"
                  />
                  {paymentErrors.cardHolder && <span className={styles.formError}>{paymentErrors.cardHolder}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>{t('expiry')}</label>
                  <input
                    className={styles.formInput}
                    value={payment.expiry}
                    onChange={e => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
                      setPayment(p => ({ ...p, expiry: v }))
                    }}
                    placeholder="12/28"
                    maxLength={5}
                  />
                  {paymentErrors.expiry && <span className={styles.formError}>{paymentErrors.expiry}</span>}
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>CVV</label>
                  <input
                    className={styles.formInput}
                    value={payment.cvv}
                    onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="123"
                    maxLength={4}
                    type="password"
                  />
                  {paymentErrors.cvv && <span className={styles.formError}>{paymentErrors.cvv}</span>}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.totalPrice}>
            <span className={styles.totalLabel}>{t('totalPrice')}</span>
            <span className={styles.totalAmount}>{formatPrice(displayPrice, currency, lang)}</span>
          </div>
          <div className={styles.footerBtns}>
            {step > 0 && (
              <button className={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                ← {lang === 'tr' ? 'Geri' : 'Back'}
              </button>
            )}
            <button
              className={`${styles.nextBtn} ${step === 2 ? styles.purchaseBtn : ''}`}
              onClick={handleNext}
              disabled={step === 0 && !selectedSeat}
            >
              {step === 2
                ? (lang === 'tr' ? '🔒 Satın Al' : '🔒 Purchase')
                : (lang === 'tr' ? 'Devam →' : 'Continue →')
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
