import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import useHabitStore from '../../store/useHabitStore.js';
import { getMonthDays } from '../../utils/dateUtils.js';
import {
  getDailyScore,
  getPeriodScore,
  getStreakCount,
  getBestStreak,
} from '../../utils/scoreUtils.js';
import ScoreStreakCard from '../shared/ScoreStreakCard.jsx';
import TypeBreakdownChart from '../shared/TypeBreakdownChart.jsx';
import { useSectionVisible } from '../../hooks/useSectionVisible.js';
import styles from './MonthlySection.module.css';

function getBarColor(score) {
  if (score > 70) return '#e8c96a';
  if (score >= 40) return '#9a7830';
  return '#3d3628';
}

export default function MonthlySection() {
  const habits = useHabitStore((s) => s.habits);
  const now = new Date();
  const todayStr = useHabitStore((s) => s.currentDate);
  const monthDays = getMonthDays(now.getFullYear(), now.getMonth());
  const { ref: headingRef, visible } = useSectionVisible();

  const barData = monthDays
    .filter((d) => d <= todayStr)
    .map((d) => {
      const dayNum = parseInt(d.split('-')[2], 10);
      const score = getDailyScore(habits, d);
      return { name: dayNum, score, dateStr: d };
    });

  const monthScore = getPeriodScore(habits, monthDays);
  const streak = getStreakCount(habits);
  const bestStreak = getBestStreak(habits);

  const monthLabel = format(now, 'MMMM yyyy');

  return (
    <section id="monthly" className={styles.section}>
      <div className={styles.container}>
        <div
          ref={headingRef}
          className={`${styles.header} ${styles.headerAnim} ${visible ? styles.headerVisible : ''}`}
        >
          <span className={styles.sectionNum}>03</span>
          <div>
            <h2 className={styles.heading}>This Month</h2>
            <span className={styles.dateLabel}>{monthLabel}</span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Card 1 — 30-Day Overview */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>30-DAY OVERVIEW</h3>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={barData}
                  margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#3d3628" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#c8b890', fontSize: 9, fontFamily: 'Courier New' }}
                    axisLine={{ stroke: '#3d3628' }}
                    tickLine={false}
                    interval={0}
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
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Bar dataKey="score" radius={[2, 2, 0, 0]} maxBarSize={14}>
                    {barData.map((entry, idx) => (
                      <Cell key={idx} fill={getBarColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 2 — Score & Streak */}
          <ScoreStreakCard score={monthScore} streak={streak} bestStreak={bestStreak} />

          {/* Card 3 — Type Breakdown */}
          <TypeBreakdownChart habits={habits} dateRange={monthDays} />
        </div>
      </div>
    </section>
  );
}
