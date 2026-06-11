// ============================================
// Navbar.jsx — Üst Navigasyon Bileşeni
// Öğrenci 1 sorumluluğu
// ============================================
import { useAppContext } from '../../context/AppContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { trackedFlights } = useAppContext()

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
