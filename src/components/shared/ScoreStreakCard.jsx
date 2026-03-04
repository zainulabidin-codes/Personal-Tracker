import styles from './ScoreStreakCard.module.css';

export default function ScoreStreakCard({ score, streak, bestStreak }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>SCORE &amp; STREAK</h3>
      <div className={styles.scoreBlock}>
        <span className={styles.scoreValue}>{score}</span>
        <span className={styles.scoreMax}>/100</span>
      </div>
      <div className={styles.streakRow}>
        <span className={styles.streakIcon}>🔥</span>
        <span className={styles.streakText}>
          Day {streak}
        </span>
      </div>
      <div className={styles.streakRow}>
        <span className={styles.streakIcon}>⭐</span>
        <span className={styles.streakText}>
          Best: {bestStreak} day{bestStreak !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
