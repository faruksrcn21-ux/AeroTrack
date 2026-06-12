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
  const [menuOpen, setMenuOpen] = useState(false)

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

        {/* Desktop right */}
        <div className={styles.right}>
          <div className={styles.selector}>
            {LANGUAGES.map(l => (
              <button key={l} className={`${styles.selectorBtn} ${lang === l ? styles.selectorActive : ''}`} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
          <div className={styles.selector}>
            {CURRENCIES.map(c => (
              <button key={c} className={`${styles.selectorBtn} ${currency === c ? styles.selectorActive : ''}`} onClick={() => setCurrency(c)}>{c}</button>
            ))}
          </div>
          <button className={styles.darkBtn} onClick={toggleDark}>{darkMode ? '☀️' : '🌙'}</button>
          <span className={styles.tag}>KOU Web Technologies</span>
          {trackedFlights.length > 0 && (
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              {trackedFlights.length} takipte
            </div>
          )}
        </div>

        {/* Mobile right */}
        <div className={styles.mobileRight}>
          {trackedFlights.length > 0 && (
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              {trackedFlights.length}
            </div>
          )}
          <button className={styles.hamburger} onClick={() => setMenuOpen(p => !p)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileRow}>
            <span className={styles.mobileLabel}>Dil</span>
            <div className={styles.selector}>
              {LANGUAGES.map(l => (
                <button key={l} className={`${styles.selectorBtn} ${lang === l ? styles.selectorActive : ''}`} onClick={() => setLang(l)}>{l}</button>
              ))}
            </div>
          </div>
          <div className={styles.mobileRow}>
            <span className={styles.mobileLabel}>Para</span>
            <div className={styles.selector}>
              {CURRENCIES.map(c => (
                <button key={c} className={`${styles.selectorBtn} ${currency === c ? styles.selectorActive : ''}`} onClick={() => setCurrency(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className={styles.mobileRow}>
            <span className={styles.mobileLabel}>Tema</span>
            <button className={styles.darkBtn} onClick={toggleDark}>{darkMode ? '☀️ Açık' : '🌙 Koyu'}</button>
          </div>
        </div>
      )}
    </nav>
  )
}