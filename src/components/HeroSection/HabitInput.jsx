import { useState } from 'react';
import useHabitStore from '../../store/useHabitStore.js';
import styles from './HabitInput.module.css';

export default function HabitInput() {
  const [text, setText] = useState('');
  const addHabit = useHabitStore((s) => s.addHabit);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    addHabit(text);
    setText('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder="Add a new habit..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className={styles.addBtn} aria-label="Add habit">
        +
      </button>
    </form>
  );
}
