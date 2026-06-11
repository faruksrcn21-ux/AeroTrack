// ============================================
// Navbar.jsx — Üst Navigasyon Bileşeni
// Öğrenci 1 sorumluluğu
// ============================================
import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import styles from './Navbar.module.css'

const LANGUAGES = ['TR', 'EN']
const CURRENCIES = ['TRY', 'USD', 'EUR']

export default function Navbar() {
  const { trackedFlights } = useAppContext()
  const [lang,     setLang]     = useState('TR')
  const [currency, setCurrency] = useState('TRY')
  const [darkMode, setDarkMode] = useState(false)

  function toggleDark() {
    setDarkMode(prev => !prev)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.inner}`}>

        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✈</span>
          <span className={styles.logoText}>
            Aero<span className={styles.logoAccent}>Track</span>
          </span>
        </div>

        {/* Sağ taraf */}
        <div className={styles.right}>

          {/* Dil seçici */}
          <div className={styles.selector}>
            {LANGUAGES.map(l => (
              <button
                key={l}
                className={`${styles.selectorBtn} ${lang === l ? styles.selectorActive : ''}`}
                onClick={() => setLang(l)}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Para birimi seçici */}
          <div className={styles.selector}>
            {CURRENCIES.map(c => (
              <button
                key={c}
                className={`${styles.selectorBtn} ${currency === c ? styles.selectorActive : ''}`}
                onClick={() => setCurrency(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Karanlık mod */}
          <button className={styles.darkBtn} onClick={toggleDark} aria-label="Tema değiştir">
            {darkMode ? '☀️' : '🌙'}
          </button>

          <span className={styles.tag}>KOU Web Technologies</span>

          {trackedFlights.length > 0 && (
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              {trackedFlights.length} takipte
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}