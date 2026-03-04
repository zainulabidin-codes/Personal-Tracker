import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useHabitStore from '../../store/useHabitStore.js';
import { today } from '../../utils/dateUtils.js';
import { getDailyScore, getStreakCount, getBestStreak } from '../../utils/scoreUtils.js';
import ScoreStreakCard from '../shared/ScoreStreakCard.jsx';
import TypeBreakdownChart from '../shared/TypeBreakdownChart.jsx';
import styles from './DailySection.module.css';

export default function DailySection() {
  const habits = useHabitStore((s) => s.habits);
  const todayStr = today();
  const score = getDailyScore(habits, todayStr);
  const streak = getStreakCount(habits);
  const bestStreak = getBestStreak(habits);

  // Data for the horizontal bar chart
  const barData = habits.map((h) => ({
    name: h.text.length > 18 ? h.text.slice(0, 18) + '…' : h.text,
    value: h.completions[todayStr] ? 100 : 0,
  }));

  const dateRange = [todayStr];

  return (
    <section id="daily" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionNum}>01</span>
          <div>
            <h2 className={styles.heading}>Daily</h2>
            <span className={styles.dateLabel}>
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Card 1 — Today's Completion Bar Chart */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>TODAY'S COMPLETION</h3>
            <div className={styles.chartWrapper}>
              {habits.length > 0 ? (
                <ResponsiveContainer width="100%" height={Math.max(180, habits.length * 36)}>
                  <BarChart
                    layout="vertical"
                    data={barData}
                    margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#3d3628" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: '#c8b890', fontSize: 10, fontFamily: 'Courier New' }}
                      axisLine={{ stroke: '#3d3628' }}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fill: '#c8b890', fontSize: 11, fontFamily: 'Times New Roman', fontStyle: 'italic' }}
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
                      formatter={(value) => [`${value}%`, 'Completion']}
                    />
                    <Bar
                      dataKey="value"
                      fill="url(#goldGradient)"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={24}
                    />
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#9a7830" />
                        <stop offset="100%" stopColor="#e8c96a" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className={styles.emptyText}>No habits yet</p>
              )}
            </div>
          </div>

          {/* Card 2 — Score & Streak */}
          <ScoreStreakCard score={score} streak={streak} bestStreak={bestStreak} />

          {/* Card 3 — Type Breakdown */}
          <TypeBreakdownChart habits={habits} dateRange={dateRange} />
        </div>
      </div>
    </section>
  );
}
