// ============================================
// SearchBar.jsx — Search Form Component
// ============================================
import { useState } from 'react'
import { validateSearchForm } from '../../utils/validators'
import { useFlights } from '../../hooks/useFlights'
import { useSearchHistory } from '../../hooks/useSearchHistory'
import styles from './SearchBar.module.css'

// Today's date (for input min value)
const todayStr = new Date().toISOString().split('T')[0]

// Formats date to readable format: "2025-06-15" → "15 Haz"
function formatHistoryDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

export default function SearchBar() {
  // Form state
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '' })
  const [errors,   setErrors]   = useState({})
  const [touched,  setTouched]  = useState({})

  const { fetchFlights }                          = useFlights()
  const { history, saveSearch, removeSearch, clearHistory } = useSearchHistory()

  // Input change handler
  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const errs = validateSearchForm({ ...formData, [name]: value })
      setErrors(prev => ({ ...prev, [name]: errs[name] }))
    }
  }

  // Blur — mark field as touched
  function handleBlur(e) {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const errs = validateSearchForm(formData)
    setErrors(prev => ({ ...prev, [name]: errs[name] }))
  }

  // Form submission
  function handleSubmit(e) {
    e.preventDefault()
    setTouched({ origin: true, destination: true, date: true })
    const validationErrors = validateSearchForm(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    saveSearch(formData)   // Save to search history
    fetchFlights(formData)
  }

  // Re-search from history — fill form and search immediately
  function handleHistoryClick(item) {
    const filled = { origin: item.origin, destination: item.destination, date: item.date }
    setFormData(filled)
    setErrors({})
    setTouched({})
    saveSearch(filled)
    fetchFlights(filled)
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Uçuş Ara</h2>

          {/* HTML form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fields}>

              {/* Origin */}
              <div className={styles.fieldGroup}>
                <label htmlFor="origin" className={styles.label}>
                  <span className={styles.labelIcon}>🛫</span> Nereden
                </label>
                <input
                  id="origin" name="origin" type="text"
                  placeholder="İstanbul, Ankara..."
                  value={formData.origin}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`${styles.input} ${errors.origin && touched.origin ? styles.inputError : ''}`}
                  autoComplete="off"
                />
                {errors.origin && touched.origin && (
                  <span className={styles.errorMsg}>{errors.origin}</span>
                )}
              </div>

              {/* Swap button */}
              <button
                type="button" className={styles.swapBtn}
                onClick={() => setFormData(prev => ({
                  ...prev, origin: prev.destination, destination: prev.origin,
                }))}
                aria-label="Kalkış ve varışı yer değiştir"
              >⇄</button>

              {/* Destination */}
              <div className={styles.fieldGroup}>
                <label htmlFor="destination" className={styles.label}>
                  <span className={styles.labelIcon}>🛬</span> Nereye
                </label>
                <input
                  id="destination" name="destination" type="text"
                  placeholder="İzmir, Antalya..."
                  value={formData.destination}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`${styles.input} ${errors.destination && touched.destination ? styles.inputError : ''}`}
                  autoComplete="off"
                />
                {errors.destination && touched.destination && (
                  <span className={styles.errorMsg}>{errors.destination}</span>
                )}
              </div>

              {/* Date */}
              <div className={styles.fieldGroup}>
                <label htmlFor="date" className={styles.label}>
                  <span className={styles.labelIcon}>📅</span> Tarih
                </label>
                <input
                  id="date" name="date" type="date"
                  min={todayStr}
                  value={formData.date}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`${styles.input} ${errors.date && touched.date ? styles.inputError : ''}`}
                />
                {errors.date && touched.date && (
                  <span className={styles.errorMsg}>{errors.date}</span>
                )}
              </div>

              {/* Search Button */}
              <button type="submit" className={styles.searchBtn}>
                <span>Uçuş Ara</span>
                <span className={styles.btnIcon}>→</span>
              </button>
            </div>
          </form>

          {/* ── Search History Panel ── */}
          {history.length > 0 && (
            <div className={styles.history}>

              {/* Title + Clear all */}
              <div className={styles.historyHeader}>
                <span className={styles.historyTitle}>Son Aramalar</span>
                <button
                  className={styles.historyClearAll}
                  onClick={clearHistory}
                  aria-label="Tüm arama geçmişini temizle"
                >
                  Tümünü sil
                </button>
              </div>

              {/* History items — rendered with .map() */}
              <div className={styles.historyList}>
                {history.map(item => (
                  <div key={item.id} className={styles.historyItem}>

                    {/* Clickable route area */}
                    <button
                      className={styles.historyBtn}
                      onClick={() => handleHistoryClick(item)}
                      aria-label={`${item.origin} → ${item.destination} aramasını tekrarla`}
                    >
                      <span className={styles.historyIcon} aria-hidden="true">🕐</span>
                      <span className={styles.historyRoute}>
                        <strong>{item.origin}</strong>
                        <span className={styles.historyArrow}>→</span>
                        <strong>{item.destination}</strong>
                      </span>
                      {item.date && (
                        <span className={styles.historyDate}>
                          {formatHistoryDate(item.date)}
                        </span>
                      )}
                    </button>

                    {/* Remove single item */}
                    <button
                      className={styles.historyRemove}
                      onClick={(e) => { e.stopPropagation(); removeSearch(item.id) }}
                      aria-label={`${item.origin} → ${item.destination} aramasını geçmişten sil`}
                    >
                      ✕
                    </button>

                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  )
}

