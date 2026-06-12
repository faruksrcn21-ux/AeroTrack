import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { useCurrency } from '../../context/CurrencyContext'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import styles from './Navbar.module.css'

const LANGUAGES = ['TR', 'EN']

export default function Navbar() {
  const { trackedFlights } = useAppContext()
  const { currency, setCurrency, currencies } = useCurrency()
  const { lang, setLanguage, t } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLanguageChange(language) {
    setLanguage(language.toLowerCase())
  }

  const trackedLabel = lang === 'tr' ? 'takipte' : t('tracking').toLowerCase()
  const themeLabel = isDark ? t('lightMode') : t('darkMode')
  const themeIcon = isDark ? '\u2600' : '\u263e'
  const menuIcon = menuOpen ? '\u00d7' : '\u2630'

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.logo}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path fill="currentColor" d="M12,2 L13,9 L22,13 L22,15 L13,13 L13,19 L16,21 L16,22 L12,21 L8,22 L8,21 L11,19 L11,13 L2,15 L2,13 L11,9 Z" />
          </svg>
          <span className={styles.logoText}>
            Aero<span className={styles.logoAccent}>Track</span>
          </span>
        </div>

        <div className={styles.right}>
          <div className={styles.selector}>
            {LANGUAGES.map(language => (
              <button
                key={language}
                className={`${styles.selectorBtn} ${lang === language.toLowerCase() ? styles.selectorActive : ''}`}
                onClick={() => handleLanguageChange(language)}
                type="button"
              >
                {language}
              </button>
            ))}
          </div>

          <div className={styles.selector}>
            {currencies.map(item => (
              <button
                key={item.code}
                className={`${styles.selectorBtn} ${currency === item.code ? styles.selectorActive : ''}`}
                onClick={() => setCurrency(item.code)}
                type="button"
                title={item.label}
              >
                {item.code}
              </button>
            ))}
          </div>

          <button className={styles.darkBtn} onClick={toggleTheme} type="button" title={themeLabel}>
            {themeIcon}
          </button>

          <span className={styles.tag}>KOU Web Technologies</span>

          {trackedFlights.length > 0 && (
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              {trackedFlights.length} {trackedLabel}
            </div>
          )}
        </div>

        <div className={styles.mobileRight}>
          {trackedFlights.length > 0 && (
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              {trackedFlights.length}
            </div>
          )}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(prev => !prev)}
            type="button"
            aria-expanded={menuOpen}
            aria-label="Menu"
          >
            {menuIcon}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileRow}>
            <span className={styles.mobileLabel}>Dil</span>
            <div className={styles.selector}>
              {LANGUAGES.map(language => (
                <button
                  key={language}
                  className={`${styles.selectorBtn} ${lang === language.toLowerCase() ? styles.selectorActive : ''}`}
                  onClick={() => handleLanguageChange(language)}
                  type="button"
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mobileRow}>
            <span className={styles.mobileLabel}>Para</span>
            <div className={styles.selector}>
              {currencies.map(item => (
                <button
                  key={item.code}
                  className={`${styles.selectorBtn} ${currency === item.code ? styles.selectorActive : ''}`}
                  onClick={() => setCurrency(item.code)}
                  type="button"
                  title={item.label}
                >
                  {item.code}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mobileRow}>
            <span className={styles.mobileLabel}>Tema</span>
            <button className={styles.darkBtn} onClick={toggleTheme} type="button">
              {themeIcon} {themeLabel}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
