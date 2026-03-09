import Navbar from './components/Navbar/Navbar.jsx';
import HeroSection from './components/HeroSection/HeroSection.jsx';
import DailySection from './components/DailySection/DailySection.jsx';
import WeeklySection from './components/WeeklySection/WeeklySection.jsx';
import MonthlySection from './components/MonthlySection/MonthlySection.jsx';
import StatsSection from './components/StatsSection/StatsSection.jsx';
import InstallPrompt from './components/InstallPrompt/InstallPrompt.jsx';
import { useMidnightReset } from './hooks/useMidnightReset.js';
import styles from './App.module.css';

export default function App() {
  useMidnightReset();

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
