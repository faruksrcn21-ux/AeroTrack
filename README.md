# ✈ AeroTrack — Dinamik Uçuş Arama ve Takip Platformu

> Kocaeli Üniversitesi, Yazılım Mühendisliği — Web Teknolojileri Dersi Projesi

AeroTrack; gerçek zamanlı uçuş verilerini kullanarak uçuş arama, gelişmiş filtreleme, anlık fiyat değişimi takibi, koltuk seçimi, mock ödeme ve dijital biniş kartı üretimi sunan premium tasarımlı bir React web uygulamasıdır.

**Repo:** [github.com/faruksrcn21-ux/AeroTrack](https://github.com/faruksrcn21-ux/AeroTrack)

---

## 🖼️ Ekran Görüntüleri

| Türkçe — Koyu Tema | English — Dark Mode | English — Light Mode |
|:---:|:---:|:---:|
| ![TR Dark](screenshot_tr_dark.png) | ![EN Dark](screenshot_en_dark.png) | ![EN Light](screenshot_en_light.png) |

---

## 🚀 Öne Çıkan Özellikler

### Uçuş Arama & Otomatik Tamamlama
- Kalkış/varış alanlarında canlı havalimanı önerileri (`/api/airports` + istemci tarafı mock fallback)
- Tek yön / gidiş-dönüş, yolcu sayısı (yetişkin, çocuk, bebek) ve kabin sınıfı seçimi
- `localStorage` tabanlı arama geçmişi

### Filtreleme & Sıralama
- En ucuz, en hızlı ve en iyi (fiyat/süre oranı) sıralama
- Aktarma sayısı, fiyat aralığı slider'ı ve havayolu filtreleri

### Takip & Bildirimler
- Takip listesi ve anlık fiyat değişimi simülasyonu
- Toast bildirimleri (fiyat düşüşü/yükselişi, kapı açılışı vb.)
- Canlı uçuş durumu simülasyonu (check-in, boarding, rötarlı…)

### Satın Alma Akışı
- Koltuk haritası üzerinden koltuk seçimi
- TC Kimlik No ve Luhn algoritmalı kredi kartı doğrulaması
- Mock ödeme ve `/api/bookings` entegrasyonu

### Biletlerim & Boarding Pass
- Dijital biniş kartı görünümü
- Bilet listeleme ve iptal

### Çoklu Dil, Kur ve Tema
- Navbar: TR/EN, TRY/USD/EUR, aydınlık/karanlık mod
- SVG güneş/ay tema ikonları, mobil hamburger menü
- Tüm metinler, fiyatlar ve validasyon mesajları seçilen dile/kura göre güncellenir

---

## 🧑‍💻 Ekip & İş Bölümü

| Öğrenci | Branch | Sorumluluk |
|---------|--------|------------|
| Öğrenci 1 | `feature/ui-components` | UI bileşenleri, CSS Modules, responsive tasarım |
| Öğrenci 2 | `feature/api-integration` | Node.js proxy, RapidAPI, `useFlights.js` |
| Öğrenci 3 | `feature/state-validations` | Context, validasyon, hook'lar, `App.jsx` entegrasyonu |

### Merge Sırası
1. `feature/api-integration` → `main`
2. `feature/ui-components` → `main`
3. `feature/state-validations` → `main` *(son entegrasyon)*

---

## 📁 Proje Yapısı

```
AeroTrack/
├── src/
│   ├── components/       # UI bileşenleri (Navbar, SearchBar, FlightCard…)
│   ├── context/          # AppContext, ThemeContext, LanguageContext, CurrencyContext
│   ├── hooks/            # useFlights, useFlightFilter, useToast, useSearchHistory
│   ├── services/         # flightApi, airportApi, bookingApi
│   ├── utils/            # validators.js
│   ├── App.jsx           # Ana entegrasyon
│   └── main.jsx          # Provider sarmalayıcıları
├── server/               # Express proxy (RapidAPI)
└── public/               # favicon, statik dosyalar
```

---

## ⚙️ Kurulum

### Ön Gereksinimler
- Node.js 18+
- npm veya yarn

### Frontend
```bash
git clone https://github.com/faruksrcn21-ux/AeroTrack.git
cd AeroTrack
npm install
npm run dev
# → http://localhost:5173
```

### Backend Proxy
```bash
cd server
npm install
cp ../.env.example ../.env
# .env dosyasına RAPIDAPI_KEY ekleyin
npm run dev
# → http://localhost:3001
```

### Mock Veri ile Test (API key'siz)
`src/hooks/useFlights.js` dosyasında:
```js
const USE_MOCK = true  // API key olmadan çalışır
```

Backend çalışmasa bile havalimanı araması istemci tarafı mock verisiyle devam eder (`airportApi.js`).

### Production Build
```bash
npm run build
npm run preview
```

---

## 🔌 Gerçek Veriye Geçiş (RapidAPI)

1. [RapidAPI](https://rapidapi.com/) üzerinden **Sky-Scrapper API**'ye abone olun
2. `.env` dosyasına anahtarınızı ekleyin:
   ```env
   RAPIDAPI_KEY=your_key_here
   RAPIDAPI_HOST=sky-scrapper.p.rapidapi.com
   PORT=3001
   ```
3. `src/hooks/useFlights.js` içinde `USE_MOCK = false` yapın

---

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React 18, Vite 5 |
| Stil | CSS Modules, CSS Custom Properties (tema) |
| HTTP | Axios |
| Backend | Node.js, Express |
| API | RapidAPI — Sky-Scrapper |

### React Kavramları

| Kavram | Kullanıldığı Yer |
|--------|-----------------|
| `useState` | Form state, modal, filtreler |
| `useEffect` | Autocomplete debounce, durum simülasyonu, localStorage |
| `useMemo` / `useCallback` | Filtreleme, çeviri fonksiyonları |
| `createContext` / `useContext` | App, Theme, Language, Currency context'leri |
| CSS Modules | Tema duyarlı bileşen stilleri |

---

## 📜 Lisans

Bu proje Kocaeli Üniversitesi Web Teknolojileri dersi kapsamında eğitim amaçlı geliştirilmiştir.
