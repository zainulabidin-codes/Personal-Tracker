import { format, parseISO } from 'date-fns';
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
import { getWeekDays, today } from '../../utils/dateUtils.js';
import {
  getDailyScore,
  getPeriodScore,
  getStreakCount,
  getBestStreak,
} from '../../utils/scoreUtils.js';
import ScoreStreakCard from '../shared/ScoreStreakCard.jsx';
import TypeBreakdownChart from '../shared/TypeBreakdownChart.jsx';
import styles from './WeeklySection.module.css';

export default function WeeklySection() {
  const habits = useHabitStore((s) => s.habits);
  const todayStr = today();
  const weekDays = getWeekDays(new Date());

  // Line chart data — score for each day of the week
  const lineData = weekDays.map((d) => ({
    name: format(parseISO(d), 'EEE'),
    score: d <= todayStr ? getDailyScore(habits, d) : null,
  }));

  const weekScore = getPeriodScore(habits, weekDays);
  const streak = getStreakCount(habits);
  const bestStreak = getBestStreak(habits);

  const rangeLabel = `${format(parseISO(weekDays[0]), 'MMM d')} – ${format(
    parseISO(weekDays[6]),
    'MMM d, yyyy'
  )}`;

  return (
    <section id="weekly" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionNum}>02</span>
          <div>
            <h2 className={styles.heading}>This Week</h2>
            <span className={styles.dateLabel}>{rangeLabel}</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Card 1 — 7-day Line Chart */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>7-DAY TREND</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={lineData}
                  margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3d3628" />
                  <XAxis
                    dataKey="name"
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
                    formatter={(value) => [`${value}%`, 'Score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#e8c96a"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#e8c96a', stroke: '#0d0b08', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#f5e078' }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2 — Score & Streak */}
          <ScoreStreakCard score={weekScore} streak={streak} bestStreak={bestStreak} />

          {/* Card 3 — Type Breakdown */}
          <TypeBreakdownChart habits={habits} dateRange={weekDays} />
        </div>
      </div>
    </section>
  );
}
