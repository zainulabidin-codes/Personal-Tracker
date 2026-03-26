import { useRef } from 'react';
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
import { useSectionVisible } from '../../hooks/useSectionVisible.js';

export default function StatsSection() {
  const habits = useHabitStore((s) => s.habits);
  const importHabits = useHabitStore((s) => s.importHabits);
  const fileInputRef = useRef(null);

  const totalHabits = habits.length;
  const totalCompletions = getTotalCompletions(habits);
  const bestStreak = getBestStreak(habits);
  const mostConsistent = getMostConsistentHabit(habits);
  const monthlyAvg = getMonthlyAverages(habits);
  const { ref: headingRef, visible } = useSectionVisible();

  const handleExport = () => {
    const dataStr = JSON.stringify(habits, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `personal-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') return;
        const importedData = JSON.parse(content);
        
        if (Array.isArray(importedData)) {
          if (confirm('Importing will replace all current data. Continue?')) {
            importHabits(importedData);
            alert('Data imported successfully!');
          }
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        console.error('Import error:', err);
        alert('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <section id="stats" className={styles.section}>
      <div className={styles.container}>
        <div
          ref={headingRef}
          className={`${styles.header} ${styles.headerAnim} ${visible ? styles.headerVisible : ''}`}
        >
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

        {/* Backup & Recovery section */}
        <div className={styles.actionsCard}>
          <h3 className={styles.cardTitle}>BACKUP & RECOVERY</h3>
          <div className={styles.actionsGrid}>
            <button className={styles.btn} onClick={handleExport}>
              Download Backup (JSON)
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleImportClick}>
              Restore from File
            </button>
            <input
              type="file"
              accept=".json"
              className={styles.fileInput}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
