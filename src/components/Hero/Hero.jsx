// ============================================
// Hero.jsx — Ana Başlık Bileşeni
// Öğrenci 1 sorumluluğu
// ============================================
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Arka plan efektleri */}
      <div className={styles.bgGlow} aria-hidden="true" />
      <div className={styles.bgOrb1} aria-hidden="true" />
      <div className={styles.bgOrb2} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} />
          Gerçek Zamanlı Uçuş Takibi
        </div>

        <h1 className={styles.title}>
          Dünyanın Her<br />
          <span className={styles.titleAccent}>Noktasına</span> Uç
        </h1>

        <p className={styles.subtitle}>
          Yüzlerce havayolu arasından en uygun biletleri bulun,
          anlık fiyat değişiklerini takip edin.
        </p>
      </div>
    </section>
  )
}