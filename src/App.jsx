// ============================================
// App.jsx — Ana Uygulama Bileşeni
// Öğrenci 3 sorumluluğu (entegrasyon)
// Tüm bileşenleri bir araya getirir
// ============================================
import { useAppContext } from './context/AppContext'
import Navbar      from './components/Navbar/Navbar'
import Hero        from './components/Hero/Hero'
import SearchBar   from './components/SearchBar/SearchBar'
import FlightCard  from './components/FlightCard/FlightCard'
import TrackedList from './components/TrackedList/TrackedList'
import { SkeletonList }   from './components/FlightCard/SkeletonCard'
import { ToastContainer } from './components/Toast/Toast'
import FilterBar          from './components/FilterBar/FilterBar'
import { useFlightFilter } from './hooks/useFlightFilter'

export default function App() {
  // Öğrenci 3: Global state'i context'ten al
  const { flights, isLoading, error, hasSearched, toasts, removeToast } = useAppContext()

  return (
    <div>
      {/* Toast bildirimleri — sağ üstte, tüm sayfanın üzerinde */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Öğrenci 1: Navbar — takip sayısını gösterir */}
      <Navbar />

      <main>
        {/* Öğrenci 1: Hero — dekoratif başlık */}
        <Hero />

        {/* Öğrenci 1 UI / Öğrenci 2 API / Öğrenci 3 validasyon */}
        <SearchBar />

        {/* Öğrenci 3: Takip listesi — state değişince anında render */}
        <TrackedList />

        {/* Sonuç Alanı */}
        <section>
          <div className="container">

            {/* Yükleniyor — Spinner yerine Skeleton cards (Öğrenci 1) */}
            {isLoading && <SkeletonList count={4} />}

            {/* Hata Durumu */}
            {error && !isLoading && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'rgba(255,71,87,0.05)',
                border: '1px solid rgba(255,71,87,0.2)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-danger)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Boş Sonuç Durumu */}
            {!isLoading && !error && hasSearched && flights.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 0',
                color: 'var(--color-text-muted)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✈</div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                  Bu kriterlere uygun uçuş bulunamadı.
                </p>
              </div>
            )}

            {/* Uçuş Kartları Listesi — .map() ile render */}
            {!isLoading && flights.length > 0 && (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                  }}>
                    Arama Sonuçları
                  </h2>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    {flights.length} uçuş bulundu
                  </span>
                </div>

                {/* Öğrenci 1: FlightCard — Props ile veri aktarımı */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {flights.map((flight, index) => (
                    <div
                      key={flight.id}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      {/* flight prop'u ile veri aktarımı */}
                      <FlightCard flight={flight} />
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        marginTop: '80px',
        padding: '32px 0',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        color: 'var(--color-text-muted)',
      }}>
        <div className="container">
          AeroTrack — Kocaeli Üniversitesi Web Teknolojileri Dersi Projesi
        </div>
      </footer>
    </div>
  )
}
