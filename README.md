# ✈️ AeroTrack — Premium Flight Search, Tracking & Booking Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-KOU-orange?style=flat-square)](#)

AeroTrack is a premium, fully responsive React web application that uses real-time aviation data to provide users with intelligent flight search, advanced filtering, live price change simulation alerts, seat map selection, Luhn algorithm-validated payments, and boarding pass management.

This project was developed as part of the **Kocaeli University, Software Engineering — Web Technologies Course Project**.

---

## 🖼️ Screenshots

| 🇹🇷 Turkish — Dark Mode (TR Dark) | 🇺🇸 English — Dark Mode (EN Dark) | 🇺🇸 English — Light Mode (EN Light) |
| :---: | :---: | :---: |
| ![TR Dark](screenshot_tr_dark.png) | ![EN Dark](screenshot_en_dark.png) | ![EN Light](screenshot_en_light.png) |

---

## 🚀 Core Features

### 🔍 1. Smart Flight Search & Autocomplete
* **Real-time Autocomplete:** Fetches airport and city codes as you type using the `/api/airports` proxy endpoint. Includes a **client-side mock fallback** to ensure uninterrupted usability during offline development or API limits.
* **Granular Search Parameters:** Supports one-way / round-trip selections, passenger counts (Adults, Children, Infants), and cabin classes (Economy, Premium Economy, Business, First Class).
* **localStorage Search History:** Saves recent searches to cache for quick re-entry and convenience.

### 🎛️ 2. Advanced Filtering & Sorting (FilterBar)
* **Smart Sorting:** Instantly sorts results by *Cheapest*, *Fastest* (shortest flight duration), and *Best* (optimized price-to-duration ratio).
* **Multi-dimensional Filters:** Refines search results in real-time by stops (Direct, 1 Stop, 2+ Stops), dynamic price range slider, and preferred airlines.

### 🔔 3. Price History Indicator & Toast Alerts
* **Price Indicator:** Displays a color-coded status bar on flight cards comparing the current flight price to the route average (Cheap, Average, Expensive).
* **Live Price Alerts:** Simulates price changes in the background for tracked flights and sends dynamic Toast alerts if a price drops or rises.

### 🎫 4. Interaktif Seat Selection & Luhn Checkout
* **Seat Map:** Renders a visual seat configuration (e.g. A1, B2) highlighting occupied and selectable seats.
* **Form Validation:** Validates passenger credentials (11-digit Turkish ID mathematical check) and simulates secure payments using the **Luhn Algorithm** for credit cards.
* **Booking Integration:** Communicates successful reservations with the `/api/bookings` endpoint and backs up bookings to local storage.

### 🌍 5. Globalization & Theme Management
* **Multi-language (i18n):** Toggles instantly between TR and EN. The dictionary covers all validation errors, form inputs, and status labels dynamically.
* **Multi-currency Converter:** Dynamically converts flight prices between TRY, USD, and EUR based on currency rates.
* **Dynamic Themes:** Built-in Light and Dark modes managed through CSS Custom Properties (variables) with a smooth transition and animated sun/moon theme triggers.

### 🌸 6. Falling Sakura Petals Visual Effect
* **Live Animation:** Features a smooth, falling sakura (cherry blossom) petal animation with wind sway simulation, creating a premium, alive, and interactive aesthetic experience across the dashboard.

---

## 📁 Repository structure

```
AeroTrack/
├── public/               # Static assets (Favicon, logos etc.)
├── server/               # Express.js API Proxy Server (Optional API Integration)
│   ├── data/             # Backend JSON databases (bookings)
│   └── index.js          # Express entry point & proxy routes
└── src/
    ├── components/       # Modular UI Components (Navbar, SearchBar, FlightCard, CheckoutModal etc.)
    ├── context/          # Context API providers (App, Theme, Language, Currency)
    ├── hooks/            # Custom React Hooks (useFlights, useFlightFilter, useToast, useSearchHistory)
    ├── services/         # API Service classes (flightApi, airportApi, bookingApi)
    ├── utils/            # Validation & pricing utilities (validators.js)
    ├── App.jsx           # Main integration page
    ├── index.css         # Design system tokens and global theme variables
    └── main.jsx          # ReactDOM Entry & context wrappers
```

---

## 🧑‍💻 Responsibility Matrix

| Student | Git Branch | Core Responsibilities |
| :--- | :--- | :--- |
| **Student 1** | `feature/ui-components` | UI/UX design, CSS Modules, responsive layouts, mobile hamburger drawer menu, theme styling variables, modal animations |
| **Student 2** | `feature/api-integration` | Express.js proxy setup, optional API proxy server-side routing, `/api/airports` and `/api/bookings` database, flight data model |
| **Student 3** | `feature/state-validations` | Context API state management, form validators (Turkish ID / Luhn Credit Card), Toast alerts engine, `App.jsx` integration |

---

## ⚙️ Installation & Setup

### 1. Prerequisites
* Node.js 18 or higher
* npm or yarn package manager

### 2. Frontend Installation
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
# → Local Address: http://localhost:5173
```

### 3. Backend Proxy Setup
```bash
# Switch to the server directory
cd server

# Install backend dependencies
npm install

# Copy environment template
cp ../.env.example ../.env
# Or on Windows PowerShell:
# Copy-Item ../.env.example ../.env

# Run the Express proxy
npm run dev
# → Proxy Address: http://localhost:3001
```

### 4. Offline Development (Mock Mode)
To work offline or save API quota, the project is configured to run on realistic mock data.
In `src/hooks/useFlights.js`:
```javascript
const USE_MOCK = true; // Set to false to enable real RapidAPI fetching
```

---

## 🔌 Live Data Integration (Optional API Configuration)

The platform is designed to run fully out-of-the-box using the built-in, realistic local database engine (no API keys required). If you wish to configure live aviation data feeds:

1. Obtain credentials from any aviation data service (e.g. flight/airport search feeds on RapidAPI).
2. Configure your environment variables in `server/.env`:
   ```env
   RAPIDAPI_KEY=your_api_key_here
   RAPIDAPI_HOST=your_api_host_here
   PORT=3001
   ```
3. Set the mock flag to `false` in `src/hooks/useFlights.js`:
   ```javascript
   const USE_MOCK = false;
   ```

---

## 🛠️ Technical Stack

### Frontend
* **React 18.3:** Declarative component architecture.
* **Vite 5:** Hot Module Replacement (HMR) bundler.
* **CSS Modules:** Scoped styling preventing global namespace leakage.
* **Axios:** Async HTTP network client.

### Backend
* **Node.js & Express:** Proxies RapidAPI requests to bypass CORS constraints and keep credentials secure.

---

## 📜 Academic License
This project has been developed strictly for educational and academic purposes for the Web Technologies course at Kocaeli University and holds no commercial license.
