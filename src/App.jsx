// ============================================
// App.jsx — Main Application Component
// Brings all components together
// ============================================
import { useAppContext } from './context/AppContext'
import { useLanguage } from './context/LanguageContext'
import Navbar      from './components/Navbar/Navbar'
import Hero        from './components/Hero/Hero'
import SearchBar   from './components/SearchBar/SearchBar'
import FilterBar   from './components/FilterBar/FilterBar'
import FlightCard  from './components/FlightCard/FlightCard'
import TrackedList from './components/TrackedList/TrackedList'
import { SkeletonList }   from './components/FlightCard/SkeletonCard'
import { ToastContainer } from './components/Toast/Toast'
import { useFlightFilter } from './hooks/useFlightFilter'

export default function App() {
  // Get global state from context
  const { flights, isLoading, error, hasSearched, toasts, removeToast } = useAppContext()
  const { t } = useLanguage()
  const { filteredFlights, setSortBy, setMaxStops, setPriceRange } = useFlightFilter(flights)

  const handleFilterChange = ({ sort, stops, maxPrice }) => {
    setSortBy(sort)
    setMaxStops(stops === 'all' ? null : Number(stops))
    setPriceRange(null, maxPrice)
  }

  return (
    <div>
      {/* Toast notifications — top-right, above all content */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {/* Navbar — shows tracked flight count */}
      <Navbar />

      <main>
        {/* Hero — decorative header */}
        <Hero />

        {/* Search form with validation and API integration */}
        <SearchBar />

        {/* Filter Bar — only show when search has results */}
        {!isLoading && !error && hasSearched && flights.length > 0 && (
          <FilterBar onFilterChange={handleFilterChange} />
        )}

        {/* Tracked flights list — re-renders on state change */}
        <TrackedList />

        {/* Results Section */}
        <section>
          <div className="container">

            {/* Loading — skeleton cards instead of spinner */}
            {isLoading && <SkeletonList count={4} />}

            {/* Error State */}
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

            {/* Empty Results State */}
            {!isLoading && !error && hasSearched && filteredFlights.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 0',
                color: 'var(--color-text-muted)',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✈</div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                  {t('noFlights')}
                </p>
              </div>
            )}

            {/* Flight Cards List — rendered with .map() */}
            {!isLoading && filteredFlights.length > 0 && (
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
                    {t('searchResults')}
                  </h2>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                  }}>
                    {filteredFlights.length} {t('flightsFound')}
                  </span>
                </div>

                {/* FlightCard — data passed via props */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {filteredFlights.map((flight, index) => (
                    <div
                      key={flight.id}
                      style={{ animationDelay: `${index * 0.08}s` }}
                    >
                      {/* Flight data via prop */}
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
          {t('footer')}
        </div>
      </footer>
    </div>
  )
}
