import useHabitStore from '../../store/useHabitStore.js';
import { getMonthDays } from '../../utils/dateUtils.js';
import HabitRow from './HabitRow.jsx';
import styles from './HabitTable.module.css';

export default function HabitTable() {
  const habits = useHabitStore((s) => s.habits);
  const now = new Date();
  const monthDays = getMonthDays(now.getFullYear(), now.getMonth());

  if (!habits.length) {
    return (
      <div className={styles.empty}>
        Add your first habit above to begin tracking.
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
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
                  return (
                    <span key={day} className={styles.dayHeader}>
                      {dayNum}
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
            <HabitRow key={habit.id} habit={habit} monthDays={monthDays} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
