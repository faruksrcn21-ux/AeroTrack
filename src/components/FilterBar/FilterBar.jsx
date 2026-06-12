// ============================================
// FilterBar.jsx — Filtreleme ve Sıralama
// Öğrenci 1 sorumluluğu
// ============================================
import { useState, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useCurrency } from '../../context/CurrencyContext'
import { formatPrice } from '../../utils/validators'
import styles from './FilterBar.module.css'

export default function FilterBar({ onFilterChange }) {
  const { t, lang } = useLanguage()
  const { currency } = useCurrency()

  const isTry = currency === 'TRY'
  const isUsd = currency === 'USD'
  const minVal = isTry ? 500 : isUsd ? 15 : 12
  const maxVal = isTry ? 10000 : isUsd ? 350 : 320
  const stepVal = isTry ? 100 : isUsd ? 5 : 5

  const [sort,     setSort]     = useState('cheapest')
  const [stops,    setStops]    = useState('all')
  const [maxPrice, setMaxPrice] = useState(maxVal)

  // Sync maxPrice when currency changes
  useEffect(() => {
    setMaxPrice(maxVal)
    onFilterChange?.({ sort, stops, maxPrice: maxVal })
  }, [currency])

  const SORT_OPTIONS = [
    { value: 'cheapest',  label: `💰 ${t('sortCheapest')}` },
    { value: 'fastest',   label: `⚡ ${t('sortFastest')}` },
    { value: 'best',      label: `⭐ ${t('sortBest')}` },
  ]

  const STOP_OPTIONS = [
    { value: 'all',    label: t('filterAll') },
    { value: '0',      label: t('filterDirect') },
    { value: '1',      label: t('filterOneStop') },
    { value: '2',      label: t('filterTwoPlus') },
  ]

  function handleSort(value) {
    setSort(value)
    onFilterChange?.({ sort: value, stops, maxPrice })
  }

  function handleStops(value) {
    setStops(value)
    onFilterChange?.({ sort, stops: value, maxPrice })
  }

  function handlePrice(e) {
    const value = Number(e.target.value)
    setMaxPrice(value)
    onFilterChange?.({ sort, stops, maxPrice: value })
  }

  return (
    <div className={styles.filterBar}>
      <div className="container">
        <div className={styles.inner}>

          {/* Sıralama */}
          <div className={styles.group}>
            <span className={styles.groupLabel}>{lang === 'tr' ? 'Sırala' : 'Sort By'}</span>
            <div className={styles.pills}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`${styles.pill} ${sort === opt.value ? styles.pillActive : ''}`}
                  onClick={() => handleSort(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Aktarma */}
          <div className={styles.group}>
            <span className={styles.groupLabel}>{t('filterStops')}</span>
            <div className={styles.pills}>
              {STOP_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`${styles.pill} ${stops === opt.value ? styles.pillActive : ''}`}
                  onClick={() => handleStops(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fiyat */}
          <div className={styles.group}>
            <span className={styles.groupLabel}>{t('filterPrice')}: {formatPrice(maxPrice, currency, lang)}</span>
            <input
              type="range"
              min={minVal}
              max={maxVal}
              step={stepVal}
              value={maxPrice}
              onChange={handlePrice}
              className={styles.slider}
            />
          </div>

        </div>
      </div>
    </div>
  )
}