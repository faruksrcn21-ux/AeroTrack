// ============================================
// FilterBar.jsx — Filtreleme ve Sıralama
// Öğrenci 1 sorumluluğu
// ============================================
import { useState } from 'react'
import styles from './FilterBar.module.css'

const SORT_OPTIONS = [
  { value: 'cheapest',  label: '💰 En Ucuz' },
  { value: 'fastest',   label: '⚡ En Hızlı' },
  { value: 'best',      label: '⭐ En İyi' },
]

const STOP_OPTIONS = [
  { value: 'all',    label: 'Tümü' },
  { value: '0',      label: 'Direkt' },
  { value: '1',      label: '1 Aktarma' },
  { value: '2',      label: '2+ Aktarma' },
]

export default function FilterBar({ onFilterChange }) {
  const [sort,     setSort]     = useState('cheapest')
  const [stops,    setStops]    = useState('all')
  const [maxPrice, setMaxPrice] = useState(10000)

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
            <span className={styles.groupLabel}>Sırala</span>
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
            <span className={styles.groupLabel}>Aktarma</span>
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
            <span className={styles.groupLabel}>Max Fiyat: ₺{maxPrice.toLocaleString()}</span>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
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