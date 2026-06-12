// ============================================
// LanguageContext.jsx — Internationalization (i18n) Context
// TR/EN dictionary structure and language state management
// ============================================
import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const LanguageContext = createContext(null)
const SUPPORTED_LANGUAGES = ['tr', 'en']

// ── Translation Dictionaries ──
const translations = {
  tr: {
    // Navbar
    appName: 'AeroTrack',
    darkMode: 'Karanlık Mod',
    lightMode: 'Aydınlık Mod',
    myBookings: 'Biletlerim',

    // Hero
    heroEyebrow: 'Gerçek Zamanlı Uçuş Takibi',
    heroTitle1: 'Dünyanın Her',
    heroTitle2: 'Noktasına',
    heroTitle3: 'Uç',
    heroSubtitle: 'Yüzlerce havayolu arasından en uygun biletleri bulun, anlık fiyat değişikliklerini takip edin.',

    // SearchBar
    searchTitle: 'Uçuş Ara',
    from: 'Nereden',
    to: 'Nereye',
    date: 'Tarih',
    returnDate: 'Dönüş Tarihi',
    searchBtn: 'Uçuş Ara',
    oneWay: 'Tek Yön',
    roundTrip: 'Gidiş-Dönüş',
    recentSearches: 'Son Aramalar',
    clearAll: 'Tümünü sil',
    placeholderFrom: 'İstanbul, Ankara...',
    placeholderTo: 'İzmir, Antalya...',

    // FilterBar
    sortCheapest: 'En Ucuz',
    sortFastest: 'En Hızlı',
    sortBest: 'En İyi',
    filterStops: 'Aktarma',
    filterDirect: 'Direkt',
    filterOneStop: '1 Aktarma',
    filterTwoPlus: '2+ Aktarma',
    filterAll: 'Tümü',
    filterPrice: 'Fiyat Aralığı',
    filterAirlines: 'Havayolları',
    resetFilters: 'Filtreleri Sıfırla',

    // FlightCard
    perPerson: 'kişi başı',
    direct: 'Direkt',
    stops: 'aktarma',
    directFlight: 'Direkt Uçuş',
    showDetails: 'Detayları Gör',
    hideDetails: 'Detayları Gizle',
    trackFlight: 'Takip Et',
    tracking: 'Takipte',
    buyTicket: 'Bilet Satın Al',
    flightInfo: 'Uçuş Bilgisi',
    flightNo: 'Uçuş no',
    duration: 'Süre',
    departure: 'Kalkış',
    arrival: 'Varış',
    transfer: 'Aktarma',
    baggage: 'Bagaj Hakkı',
    cabin: 'Kabin',
    cabinAbove: 'Kabin üstü',
    paid: 'Ücretli',
    notIncluded: 'Dahil değil',
    flexibility: 'Esneklik',
    cancel: 'İptal',
    noRefund: 'Geri ödemesiz',
    change: 'Değişiklik',
    withFee: 'Ücretli',
    seatSelect: 'Koltuk seç',
    meal: 'Yemek',
    baggageNote: '* Bagaj ve esneklik bilgileri havayoluna göre değişebilir.',

    // TrackedList
    myTracked: 'Takip Ettiklerim',
    trackedSubtitle: 'Seçtiğiniz uçuşlar — localStorage\'a kaydedildi',

    // Results
    searchResults: 'Arama Sonuçları',
    flightsFound: 'uçuş bulundu',
    noFlights: 'Bu kriterlere uygun uçuş bulunamadı.',

    // Toast
    alreadyTracked: 'zaten takipte!',
    addedToTrack: 'takibe alındı',
    removedFromTrack: 'takipten çıkarıldı',
    priceDropped: 'fiyatı düştü!',
    priceIncreased: 'fiyatı arttı!',
    bookingSuccess: 'Biletiniz başarıyla satın alındı!',
    bookingCancelled: 'Bilet iptal edildi.',

    // Checkout
    passengerInfo: 'Yolcu Bilgileri',
    firstName: 'Ad',
    lastName: 'Soyad',
    tcNumber: 'TC Kimlik No',
    paymentInfo: 'Ödeme Bilgileri',
    cardNumber: 'Kart Numarası',
    expiry: 'Son Kullanma',
    cardHolder: 'Kart Sahibi',
    seatSelection: 'Koltuk Seçimi',
    completePurchase: 'Satın Almayı Tamamla',
    totalPrice: 'Toplam Tutar',

    // Flight Status
    statusCheckin: 'Check-in Açık',
    statusBoarding: 'Biniş Başladı',
    statusDeparted: 'Kalktı',
    statusDelayed: 'Rötarlı',
    statusLanded: 'İniş Yaptı',
    statusGate: 'Kapı No',

    // Passengers
    adults: 'Yetişkin',
    children: 'Çocuk',
    infants: 'Bebek',
    passengers: 'Yolcular',
    cabinClass: 'Kabin Sınıfı',
    economy: 'Ekonomi',
    premiumEconomy: 'Premium Ekonomi',
    business: 'Business',
    firstClass: 'First Class',

    // Validation
    originRequired: 'Kalkış noktası en az 2 karakter olmalıdır.',
    originInvalid: 'Lütfen geçerli bir şehir/havalimanı adı girin.',
    destRequired: 'Varış noktası en az 2 karakter olmalıdır.',
    destInvalid: 'Lütfen geçerli bir şehir/havalimanı adı girin.',
    sameOriginDest: 'Kalkış ve varış noktaları aynı olamaz.',
    dateRequired: 'Lütfen bir tarih seçin.',
    datePast: 'Geçmiş bir tarih seçilemez.',
    returnRequired: 'Gidiş-dönüş seçiliyse dönüş tarihi zorunludur.',
    returnBeforeDep: 'Dönüş tarihi gidiş tarihinden önce olamaz.',

    // Footer
    footer: 'AeroTrack — Kocaeli Üniversitesi Web Teknolojileri Dersi Projesi',
  },

  en: {
    // Navbar
    appName: 'AeroTrack',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    myBookings: 'My Bookings',

    // Hero
    heroEyebrow: 'Real-Time Flight Tracking',
    heroTitle1: 'Fly to Any',
    heroTitle2: 'Destination',
    heroTitle3: 'in the World',
    heroSubtitle: 'Find the best deals from hundreds of airlines and track price changes in real-time.',

    // SearchBar
    searchTitle: 'Search Flights',
    from: 'From',
    to: 'To',
    date: 'Date',
    returnDate: 'Return Date',
    searchBtn: 'Search Flights',
    oneWay: 'One Way',
    roundTrip: 'Round Trip',
    recentSearches: 'Recent Searches',
    clearAll: 'Clear all',
    placeholderFrom: 'Istanbul, Ankara...',
    placeholderTo: 'Izmir, Antalya...',

    // FilterBar
    sortCheapest: 'Cheapest',
    sortFastest: 'Fastest',
    sortBest: 'Best',
    filterStops: 'Stops',
    filterDirect: 'Direct',
    filterOneStop: '1 Stop',
    filterTwoPlus: '2+ Stops',
    filterAll: 'All',
    filterPrice: 'Price Range',
    filterAirlines: 'Airlines',
    resetFilters: 'Reset Filters',

    // FlightCard
    perPerson: 'per person',
    direct: 'Direct',
    stops: 'stop(s)',
    directFlight: 'Direct Flight',
    showDetails: 'Show Details',
    hideDetails: 'Hide Details',
    trackFlight: 'Track',
    tracking: 'Tracking',
    buyTicket: 'Buy Ticket',
    flightInfo: 'Flight Info',
    flightNo: 'Flight no',
    duration: 'Duration',
    departure: 'Departure',
    arrival: 'Arrival',
    transfer: 'Transfer',
    baggage: 'Baggage',
    cabin: 'Cabin',
    cabinAbove: 'Overhead',
    paid: 'Paid',
    notIncluded: 'Not included',
    flexibility: 'Flexibility',
    cancel: 'Cancel',
    noRefund: 'Non-refundable',
    change: 'Change',
    withFee: 'With fee',
    seatSelect: 'Seat selection',
    meal: 'Meal',
    baggageNote: '* Baggage and flexibility may vary by airline.',

    // TrackedList
    myTracked: 'My Tracked Flights',
    trackedSubtitle: 'Your selected flights — saved to localStorage',

    // Results
    searchResults: 'Search Results',
    flightsFound: 'flights found',
    noFlights: 'No flights found matching your criteria.',

    // Toast
    alreadyTracked: 'is already tracked!',
    addedToTrack: 'added to tracking',
    removedFromTrack: 'removed from tracking',
    priceDropped: 'price dropped!',
    priceIncreased: 'price increased!',
    bookingSuccess: 'Your ticket has been purchased successfully!',
    bookingCancelled: 'Booking cancelled.',

    // Checkout
    passengerInfo: 'Passenger Information',
    firstName: 'First Name',
    lastName: 'Last Name',
    tcNumber: 'ID Number',
    paymentInfo: 'Payment Information',
    cardNumber: 'Card Number',
    expiry: 'Expiry',
    cardHolder: 'Card Holder',
    seatSelection: 'Seat Selection',
    completePurchase: 'Complete Purchase',
    totalPrice: 'Total Price',

    // Flight Status
    statusCheckin: 'Check-in Open',
    statusBoarding: 'Boarding',
    statusDeparted: 'Departed',
    statusDelayed: 'Delayed',
    statusLanded: 'Landed',
    statusGate: 'Gate',

    // Passengers
    adults: 'Adults',
    children: 'Children',
    infants: 'Infants',
    passengers: 'Passengers',
    cabinClass: 'Cabin Class',
    economy: 'Economy',
    premiumEconomy: 'Premium Economy',
    business: 'Business',
    firstClass: 'First Class',

    // Validation
    originRequired: 'Origin must be at least 2 characters.',
    originInvalid: 'Please enter a valid city/airport name.',
    destRequired: 'Destination must be at least 2 characters.',
    destInvalid: 'Please enter a valid city/airport name.',
    sameOriginDest: 'Origin and destination cannot be the same.',
    dateRequired: 'Please select a date.',
    datePast: 'Cannot select a past date.',
    returnRequired: 'Return date is required for round-trip.',
    returnBeforeDep: 'Return date cannot be before departure.',

    // Footer
    footer: 'AeroTrack — Kocaeli University Web Technologies Course Project',
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('aerotrack_lang')
      return SUPPORTED_LANGUAGES.includes(saved) ? saved : 'tr'
    } catch {
      return 'tr'
    }
  })

  useEffect(() => {
    document.title = lang === 'tr'
      ? 'AeroTrack — Uçuş Arama ve Takip'
      : 'AeroTrack — Flight Search & Tracking'
  }, [lang])

  const setLanguage = useCallback((nextLang) => {
    if (!SUPPORTED_LANGUAGES.includes(nextLang)) return
    setLang(nextLang)
    localStorage.setItem('aerotrack_lang', nextLang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'tr' ? 'en' : 'tr'
      localStorage.setItem('aerotrack_lang', next)
      return next
    })
  }, [])

  // Translation function — t('searchTitle') → "Uçuş Ara" or "Search Flights"
  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.tr[key] || key
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.')
  }
  return context
}
