# GEMINI.md

## Project Overview

**Personal Tracker** is a desktop-first habit tracking Progressive Web App (PWA) built with **React**, **Vite**, and **Zustand**. It provides a comprehensive dashboard for tracking habits daily, weekly, and monthly, with visual progress bars and charts powered by **Recharts**.

The application operates entirely on the client-side with no backend. It uses **IndexedDB** for high-capacity, non-blocking data persistence, replacing the legacy `localStorage` implementation.

### Core Tech Stack
- **Framework**: React 18 + Vite
- **State Management**: Zustand
- **Storage**: IndexedDB (via custom `storage.js` wrapper)
- **Charts**: Recharts
- **Styling**: CSS Modules (`*.module.css`)
- **Date Utilities**: `date-fns`
- **PWA Capabilities**: `vite-plugin-pwa` for offline support and standalone installation.

---

## Building and Running

### Development
To start the development server:
```bash
npm install
npm run dev
```

### Production Build
To build the project for production:
```bash
npm run build
```
The output will be in the `dist/` directory.

### Preview Production Build
To preview the production build locally (useful for testing PWA installation):
```bash
npm run preview
```

---

## Key Features & Logic

### Data Persistence (IndexedDB)
- The app uses `src/store/storage.js` to interact with IndexedDB.
- On the first load, the app automatically migrates legacy `localStorage` data to IndexedDB.
- A loading state in `App.jsx` handles the asynchronous initialization of the store.

### Scoring & Streaks
- **Perfect Day Streaks**: A streak only increments if **100%** of active habits for a given day are completed.
- **Score Inflation Fix**: Monthly scores are calculated against all elapsed days in the month, preventing brand-new habits from starting at an artificial 100%.
- **Daily Score**: Calculated as `(completed_active_habits / total_active_habits) * 100`.

### Midnight Reset
- The `useMidnightReset` hook uses a robust 60-second interval check to ensure the `currentDate` in the store updates correctly at midnight, even if the computer was asleep or the tab was throttled.

### Backup & Recovery
- Located in the **StatsSection**, users can export their entire habit history as a JSON file and restore it on other devices or after clearing browser data.

---

## Project Structure

- `src/components/`: Modular UI sections.
- `src/store/`: `useHabitStore.js` (logic) and `storage.js` (IndexedDB).
- `src/utils/`: Common logic for dates (`dateUtils.js`) and score calculations (`scoreUtils.js`).
- `src/hooks/`: Custom React hooks like `useMidnightReset` and `useSectionVisible`.
- `public/`: Static assets including PWA icons.

---

## Development Conventions

### State Management
- Use **Zustand** actions for all mutations. Actions are `async` as they persist to IndexedDB.
- Always check `isInitialized` if performing operations immediately on mount.

### Styling
- **CSS Modules** are mandatory for component-specific styles.
- Animations for section headers are controlled via `useSectionVisible` and the `.headerAnim` class.

### Date Handling
- Use `date-fns` via `src/utils/dateUtils.js`.
- Dates are strictly `YYYY-MM-DD` strings.

### Performance
- Avoid heavy calculations in render cycles. Scoring functions in `scoreUtils.js` are pure and can be memoized if needed.
- Event listeners (like scroll listeners in `HabitRow`) must be cleaned up properly with matching capture/bubble flags to prevent memory leaks.
