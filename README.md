# ✈ AeroTrack — Dinamik Uçuş Arama ve Takip Platformu

> Kocaeli Üniversitesi, Yazılım Mühendisliği — Web Teknolojileri Dersi

---

## Ekip & İş Bölümü

| Öğrenci | Rol | Dosyalar |
|---------|-----|---------|
| Öğrenci 1 | React UI Components & CSS | `components/*/`, `*.module.css` |
| Öğrenci 2 | API Fetch & Node.js Proxy | `server/`, `services/`, `hooks/useFlights.js` |
| Öğrenci 3 | State Management & Validations | `context/`, `utils/validators.js`, `App.jsx` |

---

## Kurulum

### 1. Ön Gereksinimler
- Node.js 18+
- npm veya yarn

### 2. Frontend Kurulumu
```bash
# Proje klasöründe
npm install
npm run dev
# → http://localhost:5173
```

### 3. Backend Proxy Kurulumu (Öğrenci 2)
```bash
cd server
npm install
cp ../.env.example ../.env
# .env dosyasına RAPIDAPI_KEY ekleyin
npm run dev
# → http://localhost:3001
```

### 4. Mock Veri ile Test (API key'siz)
`src/hooks/useFlights.js` dosyasında:
```js
const USE_MOCK = true  // API key olmadan çalışır
```

---

## Proje Yapısı

```
src/
├── components/        # Öğrenci 1 — UI bileşenleri
│   ├── Navbar/
│   ├── Hero/
│   ├── SearchBar/     # Form validasyonu (Öğrenci 3)
│   ├── FlightCard/    # "Takip Et" state (Öğrenci 3)
│   └── TrackedList/   # removeTracked state (Öğrenci 3)
├── context/
│   └── AppContext.jsx # Global state — Öğrenci 3
├── hooks/
│   ├── useFlights.js  # API fetch — Öğrenci 2
│   └── useTracked.js  # Takip hook'u — Öğrenci 3
├── services/
│   └── flightApi.js   # API servis katmanı — Öğrenci 2
└── utils/
    └── validators.js  # Form validasyonu — Öğrenci 3
```

---

## Git Workflow

```bash
git checkout -b feature/ui-components    # Öğrenci 1
git checkout -b feature/api-integration  # Öğrenci 2
git checkout -b feature/state-validations # Öğrenci 3

# Her öğrenci kendi branch'inde çalışır
# main'e merge için Pull Request açılır
```

---

## Kullanılan Derste İşlenen Teknolojiler

| Kavram | Kullanıldığı Yer |
|--------|-----------------|
| `useState` | `AppContext.jsx`, `SearchBar.jsx` |
| `useEffect` | `AppContext.jsx` (localStorage sync) |
| `useCallback` | `useFlights.js` |
| `createContext` / `useContext` | `AppContext.jsx` |
| `Props` | `FlightCard` ← `App.jsx` |
| `.map()` | `App.jsx` (flight listesi render) |
| Fetch / Axios | `flightApi.js`, `server/index.js` |
| Vite | `vite.config.js` |
| CSS Modules | `*.module.css` |
