// ============================================
// validators.js — Form Validasyon Fonksiyonları
// Öğrenci 3 sorumluluğu
// ============================================

/**
 * Arama formunu validate eder.
 * @param {Object} formData - { origin, destination, date }
 * @returns {Object} errors - Hata mesajları objesi
 */
export function validateSearchForm(formData) {
  const errors = {}

  // Kalkış validasyonu
  if (!formData.origin || formData.origin.trim().length < 2) {
    errors.origin = 'Kalkış noktası en az 2 karakter olmalıdır.'
  } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(formData.origin.trim())) {
    errors.origin = 'Lütfen geçerli bir şehir/havalimanı adı girin.'
  }

  // Varış validasyonu
  if (!formData.destination || formData.destination.trim().length < 2) {
    errors.destination = 'Varış noktası en az 2 karakter olmalıdır.'
  } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(formData.destination.trim())) {
    errors.destination = 'Lütfen geçerli bir şehir/havalimanı adı girin.'
  }

  // Aynı kalkış-varış kontrolü
  if (
    formData.origin &&
    formData.destination &&
    formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()
  ) {
    errors.destination = 'Kalkış ve varış noktaları aynı olamaz.'
  }

  // Tarih validasyonu
  if (!formData.date) {
    errors.date = 'Lütfen bir tarih seçin.'
  } else {
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Bugünün başlangıcı
    if (selectedDate < today) {
      errors.date = 'Geçmiş bir tarih seçilemez.'
    }
  }

  return errors // Boş obje döndüyse form geçerlidir
}

/**
 * Tek bir alanı validate eder (anlık validasyon için).
 * @param {string} name - Alan adı
 * @param {string} value - Alan değeri
 * @param {Object} allValues - Tüm form değerleri
 * @returns {string|null} Hata mesajı ya da null
 */
export function validateField(name, value, allValues = {}) {
  const errors = validateSearchForm({ ...allValues, [name]: value })
  return errors[name] || null
}

/**
 * Tarih değerini YYYY-MM-DD formatına çevirir.
 */
export function formatDateForApi(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

/**
 * Fiyatı Türk lirası formatında gösterir.
 */
export function formatPrice(amount, currency = 'TRY') {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Dakikayı "Xsa Ydak" formatına çevirir.
 */
export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}sa ${m}dak` : `${m}dak`
}
