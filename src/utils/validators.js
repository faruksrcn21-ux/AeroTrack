// ============================================
// validators.js — Form Validation Functions
// ============================================

/**
 * Validates the search form.
 * @param {Object} formData - { origin, destination, date }
 * @returns {Object} errors — error messages object
 */
export function validateSearchForm(formData) {
  const errors = {}

  // Origin validation
  if (!formData.origin || formData.origin.trim().length < 2) {
    errors.origin = 'originRequired'
  } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s\(\)]+$/.test(formData.origin.trim())) {
    errors.origin = 'originInvalid'
  }

  // Destination validation
  if (!formData.destination || formData.destination.trim().length < 2) {
    errors.destination = 'destRequired'
  } else if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s\(\)]+$/.test(formData.destination.trim())) {
    errors.destination = 'destInvalid'
  }

  // Same origin-destination check
  if (
    formData.origin &&
    formData.destination &&
    formData.origin.trim().toLowerCase() === formData.destination.trim().toLowerCase()
  ) {
    errors.destination = 'sameOriginDest'
  }

  // Date validation
  if (!formData.date) {
    errors.date = 'dateRequired'
  } else {
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (selectedDate < today) {
      errors.date = 'datePast'
    }
  }

  return errors // Empty object means form is valid
}

/**
 * Validates a single field (for real-time validation).
 * @param {string} name - Field name
 * @param {string} value - Field value
 * @param {Object} allValues - All form values
 * @returns {string|null} Error message or null
 */
export function validateField(name, value, allValues = {}) {
  const errors = validateSearchForm({ ...allValues, [name]: value })
  return errors[name] || null
}

/**
 * Formats a date string to YYYY-MM-DD for API usage.
 */
export function formatDateForApi(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toISOString().split('T')[0]
}

/**
 * Formats price in the selected currency and locale.
 * @param {number} amount - Price amount
 * @param {string} currency - 'TRY' | 'USD' | 'EUR'
 * @param {string} lang - 'tr' | 'en'
 */
export function formatPrice(amount, currency = 'TRY', lang = 'tr') {
  const localeMap = { tr: 'tr-TR', en: 'en-US' }
  return new Intl.NumberFormat(localeMap[lang] || 'tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Static exchange rates for mock mode currency conversion.
 * In real API mode, Sky Scrapper returns the correct currency.
 */
const EXCHANGE_RATES = { TRY: 1, USD: 0.03, EUR: 0.027 }

export function convertCurrency(amountInTRY, targetCurrency = 'TRY') {
  const rate = EXCHANGE_RATES[targetCurrency] || 1
  return Math.round(amountInTRY * rate * 100) / 100
}

/**
 * Formats minutes into "Xh Ym" display string.
 */
export function formatDuration(minutes, lang = 'tr') {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (lang === 'en') {
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }
  return h > 0 ? `${h}sa ${m}dak` : `${m}dak`
}

// ============================================
// ROUND-TRIP VALIDATION
// ============================================

/**
 * Validates round-trip form data.
 * Return date cannot be before departure date.
 * @param {Object} formData - { origin, destination, date, returnDate, tripType }
 * @returns {Object} errors
 */
export function validateRoundTrip(formData) {
  const errors = validateSearchForm(formData)

  if (formData.tripType === 'roundtrip') {
    if (!formData.returnDate) {
      errors.returnDate = 'Gidiş-dönüş seçiliyse dönüş tarihi zorunludur.'
    } else if (formData.date && formData.returnDate < formData.date) {
      errors.returnDate = 'Dönüş tarihi gidiş tarihinden önce olamaz.'
    }
  }

  return errors
}

// ============================================
// PASSENGER COUNT VALIDATION
// ============================================

/**
 * Validates passenger counts.
 * @param {Object} passengers - { adults, children, infants }
 * @returns {Object} errors
 */
export function validatePassengers(passengers) {
  const errors = {}
  const { adults = 1, children = 0, infants = 0 } = passengers
  const total = adults + children + infants

  if (adults < 1) {
    errors.adults = 'En az 1 yetişkin yolcu gereklidir.'
  }
  if (total > 9) {
    errors.total = 'Toplam yolcu sayısı 9\'u geçemez.'
  }
  if (infants > adults) {
    errors.infants = 'Bebek sayısı yetişkin sayısından fazla olamaz.'
  }

  return errors
}

// ============================================
// TC NATIONAL ID VALIDATION
// ============================================

/**
 * Validates a Turkish National ID number.
 * - Must be 11 digits
 * - Cannot start with 0
 * - Algorithmic checksum verification
 * @param {string} tcNo
 * @returns {string|null} Error message or null
 */
export function validateTCKimlik(tcNo) {
  if (!tcNo || tcNo.trim() === '') {
    return 'TC Kimlik Numarası zorunludur.'
  }

  const cleaned = tcNo.replace(/\s/g, '')

  if (!/^\d{11}$/.test(cleaned)) {
    return 'TC Kimlik Numarası 11 haneli olmalıdır.'
  }

  if (cleaned[0] === '0') {
    return 'TC Kimlik Numarası 0 ile başlayamaz.'
  }

  // Algorithmic verification
  const digits = cleaned.split('').map(Number)
  const oddSum  = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]

  const check10 = (oddSum * 7 - evenSum) % 10
  if (check10 !== digits[9]) {
    return 'Geçersiz TC Kimlik Numarası.'
  }

  const totalSum = digits.slice(0, 10).reduce((a, b) => a + b, 0)
  if (totalSum % 10 !== digits[10]) {
    return 'Geçersiz TC Kimlik Numarası.'
  }

  return null
}

// ============================================
// CREDIT CARD VALIDATION (Luhn Algorithm)
// ============================================

/**
 * Validates a credit card number using the Luhn algorithm.
 * @param {string} cardNumber
 * @returns {string|null} Error message or null
 */
export function validateCreditCard(cardNumber) {
  if (!cardNumber || cardNumber.trim() === '') {
    return 'Kart numarası zorunludur.'
  }

  const cleaned = cardNumber.replace(/[\s-]/g, '')

  if (!/^\d{13,19}$/.test(cleaned)) {
    return 'Kart numarası 13-19 haneli olmalıdır.'
  }

  // Luhn algorithm
  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }

    sum += digit
    isEven = !isEven
  }

  if (sum % 10 !== 0) {
    return 'Geçersiz kart numarası.'
  }

  return null
}

/**
 * Validates card expiry date (MM/YY format).
 * @param {string} expiry
 * @returns {string|null}
 */
export function validateCardExpiry(expiry) {
  if (!expiry) return 'Son kullanma tarihi zorunludur.'

  const match = expiry.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return 'Geçerli format: AA/YY'

  const month = parseInt(match[1], 10)
  const year  = parseInt(match[2], 10) + 2000

  if (month < 1 || month > 12) return 'Geçersiz ay.'

  const now = new Date()
  const expiryDate = new Date(year, month)

  if (expiryDate < now) return 'Kartın süresi dolmuş.'

  return null
}

/**
 * CVV validation — 3 or 4 digit numeric check.
 * @param {string} cvv
 * @returns {string|null}
 */
export function validateCVV(cvv) {
  if (!cvv) return 'CVV zorunludur.'
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV 3 veya 4 haneli olmalıdır.'
  return null
}

/**
 * Passenger name validation.
 * @param {string} name
 * @param {string} fieldLabel
 * @returns {string|null}
 */
export function validatePassengerName(name, fieldLabel = 'Bu alan') {
  if (!name || name.trim().length < 2) {
    return `${fieldLabel} en az 2 karakter olmalıdır.`
  }
  if (!/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/.test(name.trim())) {
    return `${fieldLabel} yalnızca harf içermelidir.`
  }
  return null
}
