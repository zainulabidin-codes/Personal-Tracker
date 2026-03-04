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
import { today } from '../../utils/dateUtils.js';
import styles from './TypeBreakdownChart.module.css';

export default function TypeBreakdownChart({ habits, dateRange }) {
  const todayStr = today();
  const relevantDays = dateRange.filter((d) => d <= todayStr);

  const permanent = habits.filter((h) => h.type === 'permanent');
  const daily = habits.filter((h) => h.type === 'daily');

  function getCompletionPct(habitList) {
    if (!habitList.length || !relevantDays.length) return 0;
    let total = 0;
    let possible = 0;
    for (const h of habitList) {
      for (const d of relevantDays) {
        if (d >= h.createdAt) {
          possible++;
          if (h.completions[d]) total++;
        }
      }
    }
    return possible > 0 ? Math.round((total / possible) * 100) : 0;
  }

  const data = [
    { name: 'Permanent', value: getCompletionPct(permanent) },
    { name: 'Daily', value: getCompletionPct(daily) },
  ];

  const COLORS = ['#e8c96a', '#9a7830'];

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>PERMANENT vs DAILY</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
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
              formatter={(value) => [`${value}%`, 'Completion']}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {data.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
