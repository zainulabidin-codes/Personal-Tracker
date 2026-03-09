import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import useHabitStore from '../../store/useHabitStore.js';
import { getDailyScore } from '../../utils/scoreUtils.js';
import HabitInput from './HabitInput.jsx';
import HabitTable from './HabitTable.jsx';
import { useSectionVisible } from '../../hooks/useSectionVisible.js';
import styles from './HeroSection.module.css';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getMotivationalLine(score) {
  if (score === 100) return 'Perfect day. Exceptional discipline.';
  if (score >= 70) return 'Almost there. Finish strong.';
  if (score >= 40) return 'Solid progress. Stay the course.';
  if (score > 0) return 'A good start. Keep the momentum going.';
  return 'Your slate is clean. Make today count.';
}

function formatTimeString() {
  const now = new Date();
  const day = format(now, 'EEEE').toUpperCase();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${day} · ${String(h12).padStart(2, '0')}:${minutes} ${ampm}`;
}

export default function HeroSection() {
  const { ref: headingRef, visible } = useSectionVisible();
  const habits = useHabitStore((s) => s.habits);
  const currentDate = useHabitStore((s) => s.currentDate);
  const todayScore = getDailyScore(habits, currentDate);

  const [timeStr, setTimeStr] = useState(formatTimeString);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeStr(formatTimeString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = getGreeting();
  const subLine = getMotivationalLine(todayScore);

  return (
    <section id="hero" className={styles.section}>
      <div className={styles.container}>
        {/* Greeting block */}
        <div className={styles.greetingBlock}>
          <span className={styles.greetingTime}>{timeStr}</span>
          <h1 className={styles.greetingText}>
            <span>{greeting}</span>,
          </h1>
          <p className={styles.greetingSub}>{subLine}</p>
        </div>

        <div
          ref={headingRef}
          className={`${styles.header} ${styles.headerAnim} ${visible ? styles.headerVisible : ''}`}
        >
          <span className={styles.sectionNum}>00</span>
          <h2 className={styles.heading}>Dashboard</h2>
        </div>
        <HabitInput />
        <HabitTable />
      </div>
    </section>
  );
}
