import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import useHabitStore from '../../store/useHabitStore.js';
import { getMonthDays } from '../../utils/dateUtils.js';
import { getDailyScore } from '../../utils/scoreUtils.js';
import HabitRow from './HabitRow.jsx';
import styles from './HabitTable.module.css';

export default function HabitTable() {
  const habits = useHabitStore((s) => s.habits);
  const currentDate = useHabitStore((s) => s.currentDate);
  const now = new Date();
  const monthDays = getMonthDays(now.getFullYear(), now.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  if (!habits.length) {
    return (
      <div className={styles.empty}>
        Add your first habit above to begin tracking.
      </div>
    );
  }

  function handleDayClick(day) {
    const isFuture = day > currentDate;
    const isToday = day === currentDate;
    if (isFuture) return;
    if (isToday) { setSelectedDay(null); return; }
    setSelectedDay(prev => prev === day ? null : day);
  }

  // Info bar data
  let infoBar = null;
  if (selectedDay) {
    const checked = habits.filter(h => h.completions?.[selectedDay] === true).length;
    const total = habits.length;
    const score = getDailyScore(habits, selectedDay);
    const dateLabel = format(parseISO(selectedDay), 'MMMM d, yyyy').toUpperCase();

    infoBar = (
      <div className={styles.dayInfoBar}>
        <span className={styles.infoDate}>{dateLabel}</span>
        <span className={styles.infoCount}>
          {checked} / {total} habits completed
        </span>
        <span className={styles.infoRight}>
          <span className={styles.infoScore}>{score}%</span>
          <button
            className={styles.infoClose}
            onClick={() => setSelectedDay(null)}
            aria-label="Clear selection"
          >
            ✕
          </button>
        </span>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      {infoBar}
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.thMenu} />
            <th className={styles.thPriority}>PRI</th>
            <th className={styles.thName}>HABIT</th>
            <th className={styles.thDays}>
              <div className={styles.dayHeaders}>
                {monthDays.map((day) => {
                  const dayNum = parseInt(day.split('-')[2], 10);
                  const isToday = day === currentDate;
                  const isFuture = day > currentDate;
                  const isSelected = day === selectedDay;
                  let cls = styles.dayHeader;
                  if (isToday) cls += ` ${styles.dayHeaderToday}`;
                  if (isSelected) cls += ` ${styles.dayHeaderSelected}`;
                  if (!isFuture && !isToday) cls += ` ${styles.dayHeaderClickable}`;
                  return (
                    <span
                      key={day}
                      className={cls}
                      onClick={() => handleDayClick(day)}
                    >
                      {dayNum}
                      {isToday && <span className={styles.todayDot} />}
                    </span>
                  );
                })}
              </div>
            </th>
            <th className={styles.thProgress}>PROGRESS</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              monthDays={monthDays}
              selectedDay={selectedDay}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
