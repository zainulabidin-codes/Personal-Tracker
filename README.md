# Personal Habit Tracker

A desktop habit tracking app built with React + Vite + Zustand + Recharts.

## Getting Started

```bash
npm install
npm run dev
```

## Features

### Dashboard (Hero Section)
- Add, edit, and delete habits with an inline input bar
- Full month checkbox grid for tracking daily completions
- Per-habit progress bars with completion percentages
- Priority badges and habit type indicators (permanent ∞ / daily ◈)
- Context menu (⋮) for editing name, toggling type, setting priority, and deleting

### Daily Overview
- Horizontal bar chart showing today's completion per habit
- Daily score and current/best streak display
- Permanent vs Daily type breakdown chart

### Weekly Overview
- 7-day trend line chart (Mon–Sun)
- Weekly average score with streak tracking
- Weekly type breakdown comparison

### Monthly Overview
- 30-day bar chart with color-coded scores (gold > 70%, dim 40–70%, dark < 40%)
- Monthly average score and streak stats
- Monthly type breakdown

### All-Time Stats
- Total habits created and total completions
- All-time best streak
- Most consistent habit with completion percentage
- Monthly average scores line chart over time

## Tech Stack

- **Framework**: React 18 + Vite
- **State Management**: Zustand (single store with localStorage persistence)
- **Charts**: Recharts
- **Styling**: CSS Modules
- **Date Utilities**: date-fns
- **Persistence**: localStorage (no backend, no auth)

## Project Structure

```
src/
├── main.jsx
├── App.jsx
├── App.module.css
├── index.css
├── store/
│   └── useHabitStore.js
├── utils/
│   ├── dateUtils.js
│   └── scoreUtils.js
└── components/
    ├── Navbar/
    ├── HeroSection/
    ├── DailySection/
    ├── WeeklySection/
    ├── MonthlySection/
    ├── StatsSection/
    ├── InstallPrompt/
    └── shared/
```

## Installing as a Desktop App

1. Build the app:
   ```bash
   npm run build
   ```

2. Preview the production build locally:
   ```bash
   npm run preview
   ```

3. Open http://localhost:4173 in Chrome or Edge

4. Look for the install icon (⊕) in the browser address bar
   OR wait for the install banner at the bottom of the screen

5. Click Install → the app opens as a standalone window
   with its own taskbar icon, no browser UI

6. To uninstall: right-click the app in Start Menu → Uninstall
   OR in Chrome: Menu → More Tools → Extensions →
   find the app → Remove
