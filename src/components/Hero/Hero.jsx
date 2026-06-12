import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

export default function Hero() {
  const petalsRef = useRef(null)
  const starsRef  = useRef(null)

  useEffect(() => {
    const petalColors = ['#ff9eca','#ffb8d4','#ffd4e8','#ff80b8','#ffcce0','#ff6eb0']
    const petalsEl = petalsRef.current
    const starsEl  = starsRef.current
    if (!petalsEl || !starsEl) return

    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div')
      p.className = styles.petal
      const c    = petalColors[Math.floor(Math.random() * petalColors.length)]
      const size = 6 + Math.random() * 10
      p.style.cssText = `
        left:${Math.random() * 100}%;
        width:${size}px;
        height:${size * 1.3}px;
        background:${c};
        border-radius:${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
        animation-duration:${5 + Math.random() * 8}s;
        animation-delay:${Math.random() * 8}s;
      `
      petalsEl.appendChild(p)
    }

    for (let i = 0; i < 60; i++) {
      const s = document.createElement('div')
      s.className = styles.star
      s.style.cssText = `
        left:${Math.random() * 100}%;
        top:${Math.random() * 60}%;
        animation-duration:${2 + Math.random() * 3}s;
        animation-delay:${Math.random() * 4}s;
      `
      starsEl.appendChild(s)
    }
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.glow} />
      <div className={styles.glow2} />
      <div className={styles.stars} ref={starsRef} />
      <div className={styles.petals} ref={petalsRef} />

      <img
        className={styles.planeImg}
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80"
        alt="Airplane in sky"
      /> 
      <div className={styles.overlay} />

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span className={styles.badgeText}>Gerçek Zamanlı Uçuş Takibi</span>
        </div>

        <h1 className={styles.title}>
          Dünyanın Her<br />
          <span className={styles.titleAccent}>Noktasına</span> Uç
        </h1>

        <p className={styles.subtitle}>
          Yüzlerce havayolu arasından en uygun biletleri bulun,
          anlık fiyat değişikliklerini takip edin.
        </p>

        <div className={styles.actions}>
          <button className={styles.btnPrimary}>✈ Uçuş Ara</button>
          <button className={styles.btnSecondary}>Nasıl çalışır?</button>
        </div>
      </div>

      <div className={styles.horizon} />
    </section>
  )
}