import HabitInput from './HabitInput.jsx';
import HabitTable from './HabitTable.jsx';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section id="hero" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionNum}>00</span>
          <h2 className={styles.heading}>Dashboard</h2>
        </div>
        <HabitInput />
        <HabitTable />
      </div>
    </section>
  );
}
