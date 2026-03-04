import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useHabitStore from '../../store/useHabitStore.js';
import {
  getBestStreak,
  getMostConsistentHabit,
  getTotalCompletions,
  getMonthlyAverages,
} from '../../utils/scoreUtils.js';
import styles from './StatsSection.module.css';

export default function StatsSection() {
  const habits = useHabitStore((s) => s.habits);

  const totalHabits = habits.length;
  const totalCompletions = getTotalCompletions(habits);
  const bestStreak = getBestStreak(habits);
  const mostConsistent = getMostConsistentHabit(habits);
  const monthlyAvg = getMonthlyAverages(habits);

  return (
    <section id="stats" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionNum}>04</span>
          <h2 className={styles.heading}>All Time</h2>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalHabits}</span>
            <span className={styles.statLabel}>TOTAL HABITS</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalCompletions}</span>
            <span className={styles.statLabel}>TOTAL COMPLETIONS</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{bestStreak}</span>
            <span className={styles.statLabel}>BEST STREAK (DAYS)</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>
              {mostConsistent ? mostConsistent.pct + '%' : '—'}
            </span>
            <span className={styles.statLabel}>
              {mostConsistent
                ? `MOST CONSISTENT: ${mostConsistent.text}`
                : 'MOST CONSISTENT'}
            </span>
          </div>
        </div>

        {/* Monthly average line chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>MONTHLY AVERAGES</h3>
          <div className={styles.chartWrapper}>
            {monthlyAvg.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart
                  data={monthlyAvg}
                  margin={{ top: 8, right: 24, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3d3628" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#c8b890', fontSize: 11, fontFamily: 'Courier New' }}
                    axisLine={{ stroke: '#3d3628' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#c8b890', fontSize: 10, fontFamily: 'Courier New' }}
                    axisLine={{ stroke: '#3d3628' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#252118',
                      border: '1px solid #5a4f38',
                      borderRadius: 6,
                      fontFamily: 'Courier New',
                      fontSize: 12,
                      color: '#f5edd8',
                    }}
                    formatter={(value) => [`${value}%`, 'Avg Score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#e8c96a"
                    strokeWidth={2}
                    dot={{ r: 5, fill: '#e8c96a', stroke: '#0d0b08', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#f5e078' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className={styles.emptyText}>Add habits to see monthly trends</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
