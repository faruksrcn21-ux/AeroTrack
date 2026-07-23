# ✈️ AeroTrack — Flight Search, Tracking & Booking Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com/)

AeroTrack is a fully responsive React web application that provides intelligent flight search, advanced filtering, live price-change alerts, seat map selection, Luhn-algorithm payment validation, and boarding pass management.

**[🔗 Live Demo](https://aero-track-eight.vercel.app/)**

Originally built as a 3-person team project for the Web Technologies course at Kocaeli University, Software Engineering. My contribution covered Context API state management, form validation logic (Turkish ID checksum, Luhn algorithm), and the toast notification engine, while teammates handled UI/UX component design and the Express API integration.

---

## 🖼️ Screenshots

| Turkish — Dark Mode | English — Dark Mode | English — Light Mode |
| :---: | :---: | :---: |
| ![TR Dark](screenshot_tr_dark.png) | ![EN Dark](screenshot_en_dark.png) | ![EN Light](screenshot_en_light.png) |

---

## 🚀 Core Features

### 🔍 Smart Flight Search & Autocomplete
* Real-time airport/city autocomplete via the `/api/airports` proxy endpoint, with a client-side mock fallback for offline development.
* Granular search parameters: one-way / round-trip, passenger counts (Adults, Children, Infants), and cabin classes (Economy, Premium Economy, Business, First Class).
* localStorage-backed search history for quick re-entry.

### 🎛️ Advanced Filtering & Sorting
* Smart sorting by Cheapest, Fastest, and Best (price-to-duration ratio).
* Multi-dimensional filters: stops, dynamic price range slider, and preferred airlines.

### 🔔 Price History Indicator & Toast Alerts
* Color-coded price status on flight cards (Cheap / Average / Expensive) relative to the route average.
* Simulated live price tracking with dynamic toast alerts on price drops or rises.

### 🎫 Interactive Seat Selection & Checkout
* Visual seat map with occupied/selectable seat states.
* Passenger validation (Turkish ID checksum) and simulated secure payment using the Luhn algorithm.
* Booking flow integrated with the `/api/bookings` endpoint, with local storage backup.

### 🌍 Globalization & Theming
* Full TR/EN multi-language support covering all UI text, validation errors, and labels.
* Multi-currency conversion (TRY, USD, EUR).
* Light/dark theme system built on CSS Custom Properties with animated theme toggle.

### 🌸 Visual Polish
* Animated falling petal effect with wind-sway simulation for a distinctive dashboard feel.

---

## 🛠️ Technical Stack

**Frontend:** React 18.3, Vite 5, CSS Modules, Axios
**Backend:** Node.js + Express (proxies external API requests, keeps credentials server-side)

---

## 📁 Repository Structure

```
AeroTrack/
├── public/               # Static assets
├── server/               # Express.js API proxy server
│   ├── data/              # Backend JSON databases (bookings)
│   └── index.js           # Express entry point & proxy routes
└── src/
    ├── components/        # Navbar, SearchBar, FlightCard, CheckoutModal, etc.
    ├── context/            # App, Theme, Language, Currency providers
    ├── hooks/              # useFlights, useFlightFilter, useToast, useSearchHistory
    ├── services/           # flightApi, airportApi, bookingApi
    ├── utils/              # Validation & pricing utilities
    ├── App.jsx             # Main integration page
    ├── index.css           # Design tokens and global theme variables
    └── main.jsx            # ReactDOM entry & context wrappers
```

---

## ⚙️ Installation & Setup

### Prerequisites
* Node.js 18 or higher
* npm or yarn

### Frontend
```bash
npm install
npm run dev
# → http://localhost:5173
```

### Backend Proxy
```bash
cd server
npm install
cp ../.env.example ../.env
npm run dev
# → http://localhost:3001
```

### Offline / Mock Mode
The project runs out of the box on realistic mock data — no API keys required.
In `src/hooks/useFlights.js`:
```javascript
const USE_MOCK = true; // set to false to enable live API fetching
```

To connect a real aviation data feed, add credentials to `server/.env`:
```env
RAPIDAPI_KEY=your_api_key_here
RAPIDAPI_HOST=your_api_host_here
PORT=3001
```

---

## 📜 Note

Originally developed as a university coursework project. Shared here as a portfolio piece demonstrating full-stack React/Node development.
