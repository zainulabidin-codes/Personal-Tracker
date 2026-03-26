import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import HeroSection from './components/HeroSection/HeroSection.jsx';
import DailySection from './components/DailySection/DailySection.jsx';
import WeeklySection from './components/WeeklySection/WeeklySection.jsx';
import MonthlySection from './components/MonthlySection/MonthlySection.jsx';
import StatsSection from './components/StatsSection/StatsSection.jsx';
import InstallPrompt from './components/InstallPrompt/InstallPrompt.jsx';
import { useMidnightReset } from './hooks/useMidnightReset.js';
import useHabitStore from './store/useHabitStore.js';
import styles from './App.module.css';

export default function App() {
  const initialize = useHabitStore((s) => s.initialize);
  const isInitialized = useHabitStore((s) => s.isInitialized);
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  useMidnightReset();

  if (!isInitialized) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Restoring session...</p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <Navbar />
      <main>
        <HeroSection />
        <DailySection />
        <WeeklySection />
        <MonthlySection />
        <StatsSection />
      </main>
      <InstallPrompt />
    </div>
  );
}
