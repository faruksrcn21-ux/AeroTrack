// ============================================
// SearchBar.jsx — Search Form Component
// ============================================
import { useState, useEffect, useRef } from 'react'
import { validateSearchForm } from '../../utils/validators'
import { useFlights } from '../../hooks/useFlights'
import { useSearchHistory } from '../../hooks/useSearchHistory'
import { useLanguage } from '../../context/LanguageContext'
import { useDebounce } from '../../hooks/useDebounce'
import { searchAirports } from '../../services/airportApi'
import styles from './SearchBar.module.css'

const todayStr = new Date().toISOString().split('T')[0]

function formatHistoryDate(dateStr, lang = 'tr') {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short' })
}

export default function SearchBar() {
  const { t, lang } = useLanguage()
  
  const [tripType, setTripType] = useState('oneway') // 'oneway' | 'roundtrip'
  const [formData, setFormData] = useState({ origin: '', destination: '', date: '', returnDate: '' })
  const [errors,   setErrors]   = useState({})
  const [touched,  setTouched]  = useState({})

  // Autocomplete states
  const [originSuggestions, setOriginSuggestions] = useState([])
  const [destSuggestions, setDestSuggestions] = useState([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestSuggestions, setShowDestSuggestions] = useState(false)

  // Passenger and Cabin class states
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [cabinClass, setCabinClass] = useState('economy')
  const [showPassengers, setShowPassengers] = useState(false)

  const passengerRef = useRef(null)

  const debouncedOrigin = useDebounce(formData.origin, 300)
  const debouncedDest = useDebounce(formData.destination, 300)

  const { fetchFlights }                                    = useFlights()
  const { history, saveSearch, removeSearch, clearHistory } = useSearchHistory()

  // Close passenger popup on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (passengerRef.current && !passengerRef.current.contains(event.target)) {
        setShowPassengers(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch origin suggestions
  useEffect(() => {
    if (debouncedOrigin.trim().length < 2) {
      setOriginSuggestions([])
      return
    }
    // Don't search if it matches an already selected airport template
    if (debouncedOrigin.includes('(') && debouncedOrigin.includes(')')) return

    let active = true
    searchAirports(debouncedOrigin, lang).then(data => {
      if (active) setOriginSuggestions(data)
    }).catch(console.error)
    return () => { active = false }
  }, [debouncedOrigin, lang])

  // Fetch destination suggestions
  useEffect(() => {
    if (debouncedDest.trim().length < 2) {
      setDestSuggestions([])
      return
    }
    // Don't search if it matches an already selected airport template
    if (debouncedDest.includes('(') && debouncedDest.includes(')')) return

    let active = true
    searchAirports(debouncedDest, lang).then(data => {
      if (active) setDestSuggestions(data)
    }).catch(console.error)
    return () => { active = false }
  }, [debouncedDest, lang])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const errs = validateSearchForm({ ...formData, [name]: value })
      setErrors(prev => ({ ...prev, [name]: errs[name] }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const errs = validateSearchForm(formData)
    setErrors(prev => ({ ...prev, [name]: errs[name] }))

    // Close suggestions with small delay so click registers
    setTimeout(() => {
      if (name === 'origin') setShowOriginSuggestions(false)
      if (name === 'destination') setShowDestSuggestions(false)
    }, 200)
  }

  function handleOriginSelect(item) {
    setFormData(prev => ({ ...prev, origin: item.iata ? `${item.city} (${item.iata})` : item.name }))
    setShowOriginSuggestions(false)
  }

  function handleDestSelect(item) {
    setFormData(prev => ({ ...prev, destination: item.iata ? `${item.city} (${item.iata})` : item.name }))
    setShowDestSuggestions(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched({ origin: true, destination: true, date: true })
    const validationErrors = validateSearchForm(formData)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const searchParams = {
      ...formData,
      adults,
      children,
      infants,
      cabinClass
    }
    saveSearch(searchParams)
    fetchFlights(searchParams)
  }

  function handleHistoryClick(item) {
    const filled = { origin: item.origin, destination: item.destination, date: item.date, returnDate: item.returnDate || '' }
    setFormData(filled)
    if (item.adults) setAdults(Number(item.adults))
    if (item.children !== undefined) setChildren(Number(item.children))
    if (item.infants !== undefined) setInfants(Number(item.infants))
    if (item.cabinClass) setCabinClass(item.cabinClass)
    setErrors({})
    setTouched({})
    
    const searchParams = {
      ...filled,
      adults: item.adults || adults,
      children: item.children !== undefined ? item.children : children,
      infants: item.infants !== undefined ? item.infants : infants,
      cabinClass: item.cabinClass || cabinClass
    }
    saveSearch(searchParams)
    fetchFlights(searchParams)
  }

  return (
    <section className={styles.section} data-section="search">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{t('searchTitle')}</h2>

            <div className={styles.configsRow}>
              {/* Tek Yön / Gidiş-Dönüş */}
              <div className={styles.tripToggle}>
                <button
                  type="button"
                  className={`${styles.tripBtn} ${tripType === 'oneway' ? styles.tripBtnActive : ''}`}
                  onClick={() => setTripType('oneway')}
                >
                  {t('oneWay')}
                </button>
                <button
                  type="button"
                  className={`${styles.tripBtn} ${tripType === 'roundtrip' ? styles.tripBtnActive : ''}`}
                  onClick={() => setTripType('roundtrip')}
                >
                  {t('roundTrip')}
                </button>
              </div>

              {/* Cabin Class Selection */}
              <select 
                className={styles.configSelect}
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
              >
                <option value="economy">{t('economy')}</option>
                <option value="premium_economy">{t('premiumEconomy')}</option>
                <option value="business">{t('business')}</option>
                <option value="first">{t('firstClass')}</option>
              </select>

              {/* Passengers Dropdown */}
              <div className={styles.passengerSelector} ref={passengerRef}>
                <button 
                  type="button" 
                  className={styles.passengerBtn}
                  onClick={() => setShowPassengers(prev => !prev)}
                >
                  👤 {adults + children + infants} {t('passengers')}
                </button>
                {showPassengers && (
                  <div className={styles.passengerPopup}>
                    <div className={styles.passengerRow}>
                      <div className={styles.passengerLabel}>
                        <span className={styles.passengerName}>{t('adults')}</span>
                        <span className={styles.passengerDesc}>12+</span>
                      </div>
                      <div className={styles.passengerControls}>
                        <button 
                          type="button" className={styles.controlBtn}
                          disabled={adults <= 1}
                          onClick={() => setAdults(prev => prev - 1)}
                        >-</button>
                        <span className={styles.controlValue}>{adults}</span>
                        <button 
                          type="button" className={styles.controlBtn}
                          disabled={adults >= 9}
                          onClick={() => setAdults(prev => prev + 1)}
                        >+</button>
                      </div>
                    </div>

                    <div className={styles.passengerRow}>
                      <div className={styles.passengerLabel}>
                        <span className={styles.passengerName}>{t('children')}</span>
                        <span className={styles.passengerDesc}>2-11</span>
                      </div>
                      <div className={styles.passengerControls}>
                        <button 
                          type="button" className={styles.controlBtn}
                          disabled={children <= 0}
                          onClick={() => setChildren(prev => prev - 1)}
                        >-</button>
                        <span className={styles.controlValue}>{children}</span>
                        <button 
                          type="button" className={styles.controlBtn}
                          disabled={children >= 9}
                          onClick={() => setChildren(prev => prev + 1)}
                        >+</button>
                      </div>
                    </div>

                    <div className={styles.passengerRow}>
                      <div className={styles.passengerLabel}>
                        <span className={styles.passengerName}>{t('infants')}</span>
                        <span className={styles.passengerDesc}>0-2</span>
                      </div>
                      <div className={styles.passengerControls}>
                        <button 
                          type="button" className={styles.controlBtn}
                          disabled={infants <= 0}
                          onClick={() => setInfants(prev => prev - 1)}
                        >-</button>
                        <span className={styles.controlValue}>{infants}</span>
                        <button 
                          type="button" className={styles.controlBtn}
                          disabled={infants >= adults}
                          onClick={() => setInfants(prev => prev + 1)}
                        >+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.fields}>

              {/* Origin */}
              <div className={styles.fieldGroupRelative}>
                <label htmlFor="origin" className={styles.label}>
                  <span className={styles.labelIcon}>🛫</span> {t('from')}
                </label>
                <input
                  id="origin" name="origin" type="text"
                  placeholder={t('placeholderFrom')}
                  value={formData.origin}
                  onChange={handleChange} onBlur={handleBlur}
                  onFocus={() => setShowOriginSuggestions(true)}
                  className={`${styles.input} ${errors.origin && touched.origin ? styles.inputError : ''}`}
                  autoComplete="off"
                />
                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <div className={styles.suggestionsDropdown}>
                    {originSuggestions.map(item => (
                      <button
                        key={item.skyId + '-' + item.entityId}
                        type="button"
                        className={styles.suggestionItem}
                        onMouseDown={() => handleOriginSelect(item)}
                      >
                        <span className={styles.suggestionTitle}>{item.name} ({item.iata})</span>
                        <span className={styles.suggestionSubtitle}>{item.city}, {item.country}</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.origin && touched.origin && (
                  <span className={styles.errorMsg}>{t(errors.origin)}</span>
                )}
              </div>

              {/* Swap */}
              <button
                type="button" className={styles.swapBtn}
                onClick={() => setFormData(prev => ({ ...prev, origin: prev.destination, destination: prev.origin }))}
                aria-label="Kalkış ve varışı yer değiştir"
              >⇄</button>

              {/* Destination */}
              <div className={styles.fieldGroupRelative}>
                <label htmlFor="destination" className={styles.label}>
                  <span className={styles.labelIcon}>🛬</span> {t('to')}
                </label>
                <input
                  id="destination" name="destination" type="text"
                  placeholder={t('placeholderTo')}
                  value={formData.destination}
                  onChange={handleChange} onBlur={handleBlur}
                  onFocus={() => setShowDestSuggestions(true)}
                  className={`${styles.input} ${errors.destination && touched.destination ? styles.inputError : ''}`}
                  autoComplete="off"
                />
                {showDestSuggestions && destSuggestions.length > 0 && (
                  <div className={styles.suggestionsDropdown}>
                    {destSuggestions.map(item => (
                      <button
                        key={item.skyId + '-' + item.entityId}
                        type="button"
                        className={styles.suggestionItem}
                        onMouseDown={() => handleDestSelect(item)}
                      >
                        <span className={styles.suggestionTitle}>{item.name} ({item.iata})</span>
                        <span className={styles.suggestionSubtitle}>{item.city}, {item.country}</span>
                      </button>
                    ))}
                  </div>
                )}
                {errors.destination && touched.destination && (
                  <span className={styles.errorMsg}>{t(errors.destination)}</span>
                )}
              </div>

              {/* Gidiş Tarihi */}
              <div className={styles.fieldGroup}>
                <label htmlFor="date" className={styles.label}>
                  <span className={styles.labelIcon}>📅</span> {tripType === 'roundtrip' ? t('date') : t('date')}
                </label>
                <input
                  id="date" name="date" type="date"
                  min={todayStr}
                  value={formData.date}
                  onChange={handleChange} onBlur={handleBlur}
                  className={`${styles.input} ${errors.date && touched.date ? styles.inputError : ''}`}
                />
                {errors.date && touched.date && (
                  <span className={styles.errorMsg}>{t(errors.date)}</span>
                )}
              </div>

              {/* Dönüş Tarihi — sadece roundtrip'te */}
              {tripType === 'roundtrip' && (
                <div className={styles.fieldGroup}>
                  <label htmlFor="returnDate" className={styles.label}>
                    <span className={styles.labelIcon}>📅</span> {t('returnDate')}
                  </label>
                  <input
                    id="returnDate" name="returnDate" type="date"
                    min={formData.date || todayStr}
                    value={formData.returnDate}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              )}

              {/* Search Button */}
              <button type="submit" className={styles.searchBtn}>
                <span>{t('searchBtn')}</span>
                <span className={styles.btnIcon}>→</span>
              </button>

            </div>
          </form>

          {/* Search History */}
          {history.length > 0 && (
            <div className={styles.history}>
              <div className={styles.historyHeader}>
                <span className={styles.historyTitle}>{t('recentSearches')}</span>
                <button className={styles.historyClearAll} onClick={clearHistory}>{t('clearAll')}</button>
              </div>
              <div className={styles.historyList}>
                {history.map(item => (
                  <div key={item.id} className={styles.historyItem}>
                    <button className={styles.historyBtn} onClick={() => handleHistoryClick(item)}>
                      <span className={styles.historyIcon}>🕐</span>
                      <span className={styles.historyRoute}>
                        <strong>{item.origin}</strong>
                        <span className={styles.historyArrow}>→</span>
                        <strong>{item.destination}</strong>
                      </span>
                      {item.date && <span className={styles.historyDate}>{formatHistoryDate(item.date, lang)}</span>}
                    </button>
                    <button className={styles.historyRemove} onClick={(e) => { e.stopPropagation(); removeSearch(item.id) }}>✕</button>
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