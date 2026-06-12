import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import styles from './Hero.module.css'

export default function Hero() {
  const petalsRef = useRef(null)
  const starsRef  = useRef(null)
  const { t, lang } = useLanguage()
  const [showHowItWorks, setShowHowItWorks] = useState(false)

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

  // "Uçuş Ara" butonu — SearchBar'a smooth scroll
  const handleSearchClick = () => {
    const searchSection = document.querySelector('[data-section="search"]') 
      || document.querySelector('.search-bar-section')
      || document.querySelector('form')
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  // "Nasıl çalışır?" butonu — bilgi panelini aç/kapat
  const handleHowItWorks = () => {
    setShowHowItWorks(prev => !prev)
  }

  const howItWorksSteps = lang === 'tr' ? [
    { icon: '🔍', title: 'Uçuş Ara', desc: 'Kalkış ve varış noktanızı, tarihinizi seçin.' },
    { icon: '📊', title: 'Karşılaştır', desc: 'Yüzlerce uçuş arasından en uygununu filtreleyin.' },
    { icon: '📌', title: 'Takip Et', desc: 'Beğendiğiniz uçuşları takibe alın, fiyat düşünce bildirim alın.' },
    { icon: '🎫', title: 'Satın Al', desc: 'Koltuğunuzu seçin ve biletinizi satın alın.' },
  ] : [
    { icon: '🔍', title: 'Search', desc: 'Enter your origin, destination and travel date.' },
    { icon: '📊', title: 'Compare', desc: 'Filter and sort hundreds of flights to find the best deal.' },
    { icon: '📌', title: 'Track', desc: 'Track your favorite flights and get notified on price drops.' },
    { icon: '🎫', title: 'Book', desc: 'Select your seat and purchase your ticket.' },
  ]

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
          <span className={styles.badgeText}>{t('heroEyebrow')}</span>
        </div>

        <h1 className={styles.title}>
          {t('heroTitle1')}<br />
          <span className={styles.titleAccent}>{t('heroTitle2')}</span> {t('heroTitle3')}
        </h1>

        <p className={styles.subtitle}>
          {t('heroSubtitle')}
        </p>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={handleSearchClick}>
            ✈ {t('searchBtn')}
          </button>
          <button className={styles.btnSecondary} onClick={handleHowItWorks}>
            {showHowItWorks ? '✕' : '?'} {lang === 'tr' ? 'Nasıl çalışır?' : 'How it works?'}
          </button>
        </div>

        {/* How It Works — Açılır bilgi paneli */}
        {showHowItWorks && (
          <div className={styles.howItWorks}>
            {howItWorksSteps.map((step, i) => (
              <div key={i} className={styles.howStep}>
                <span className={styles.howIcon}>{step.icon}</span>
                <div>
                  <strong className={styles.howTitle}>{step.title}</strong>
                  <p className={styles.howDesc}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.horizon} />
    </section>
  )
}