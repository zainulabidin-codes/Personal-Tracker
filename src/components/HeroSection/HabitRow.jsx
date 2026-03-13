import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useHabitStore from '../../store/useHabitStore.js';
import { getMonthDays } from '../../utils/dateUtils.js';
import { getHabitMonthlyScore } from '../../utils/scoreUtils.js';
import styles from './HabitRow.module.css';

export default function HabitRow({ habit, monthDays, selectedDay }) {
  const {
    deleteHabit,
    editHabit,
    toggleCompletion,
    setHabitType,
    setHabitPriority,
  } = useHabitStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({});
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(habit.text);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pulsedDay, setPulsedDay] = useState(null);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const editRef = useRef(null);

  const todayStr = useHabitStore((s) => s.currentDate);

  // Close menu on outside click or Escape; keep position synced while scrolling
  useEffect(() => {
    if (!menuOpen) return;

    function handleOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    }

    function handleEscape(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setConfirmDelete(false);
      }
    }

    function handleScroll() {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setMenuPosition({
          position: 'fixed',
          top: rect.bottom + 8 + 'px',
          left: rect.left + 'px',
          zIndex: 9999,
        });
      }
    }

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [menuOpen]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.focus();
      editRef.current.select();
    }
  }, [editing]);

  function handleEditSave() {
    if (editText.trim()) {
      editHabit(habit.id, editText);
    } else {
      setEditText(habit.text);
    }
    setEditing(false);
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Enter') handleEditSave();
    if (e.key === 'Escape') {
      setEditText(habit.text);
      setEditing(false);
    }
  }

  // Calculate progress for this month using corrected formula
  const score = getHabitMonthlyScore(habit);

  const priorityDots = '•'.repeat(habit.priority);
  const typeSymbol = habit.type === 'permanent' ? '∞' : '◈';

  return (
    <tr className={styles.row}>
      {/* Column 1 — ⋮ menu */}
      <td className={styles.menuCell}>
        <button
          ref={triggerRef}
          className={styles.menuBtn}
          onClick={() => {
            if (!menuOpen && triggerRef.current) {
              const rect = triggerRef.current.getBoundingClientRect();
              setMenuPosition({
                position: 'fixed',
                top: rect.bottom + 8 + 'px',
                left: rect.left + 'px',
                zIndex: 9999,
              });
            }
            setMenuOpen((o) => !o);
            setConfirmDelete(false);
          }}
          aria-label="Habit options"
        >
          ⋮
        </button>
        {menuOpen &&
          ReactDOM.createPortal(
            <div
              ref={dropdownRef}
              className={styles.dropdownMenu}
              style={menuPosition}
            >
              {/* Edit */}
              <button
                className={styles.menuItem}
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
              >
                Edit name
              </button>

              {/* Toggle type */}
              <button
                className={styles.menuItem}
                onClick={() => {
                  setHabitType(
                    habit.id,
                    habit.type === 'permanent' ? 'daily' : 'permanent'
                  );
                }}
              >
                <span className={styles.typeDot}>
                  {habit.type === 'permanent' ? '●' : '○'}
                </span>
                {habit.type === 'permanent' ? 'Permanent' : 'Daily'}
                <span className={styles.switchHint}>→ switch</span>
              </button>

              <hr className={styles.menuDivider} />

              {/* Priority sub-options */}
              <div className={styles.menuLabel}>Priority</div>
              <div className={styles.priorityGroup}>
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className={`${styles.priorityOption} ${
                      habit.priority === p ? styles.priorityActive : ''
                    }`}
                    onClick={() => setHabitPriority(habit.id, p)}
                  >
                    {'●'.repeat(p)}
                  </button>
                ))}
              </div>

              <hr className={styles.menuDivider} />

              {/* Delete */}
              {!confirmDelete ? (
                <button
                  className={`${styles.menuItem} ${styles.deleteItem}`}
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </button>
              ) : (
                <button
                  className={`${styles.menuItem} ${styles.deleteItem}`}
                  onClick={() => {
                    deleteHabit(habit.id);
                    setMenuOpen(false);
                  }}
                >
                  Confirm Delete?
                </button>
              )}
            </div>,
            document.body
          )}
      </td>

      {/* Column 2 — Priority badge */}
      <td className={styles.priorityCell}>
        <span className={styles.priorityBadge}>{priorityDots}</span>
      </td>

      {/* Column 3 — Habit name */}
      <td className={styles.nameCell}>
        <div className={styles.nameWrapper}>
          {editing ? (
            <input
              ref={editRef}
              className={styles.editInput}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditSave}
            />
          ) : (
            <span
              className={styles.habitText}
              style={
                selectedDay
                  ? {
                      color: habit.completions?.[selectedDay]
                        ? 'var(--gold)'
                        : 'var(--text-muted)',
                    }
                  : undefined
              }
            >
              {habit.text}
              <span className={styles.typeSymbol}>{typeSymbol}</span>
            </span>
          )}
          <button
            className={styles.quickDelete}
            onClick={() => deleteHabit(habit.id)}
            aria-label="Quick delete"
          >
            ✕
          </button>
        </div>
      </td>

      {/* Column 4 — Day checkboxes */}
      <td className={styles.checkboxesCell}>
        <div className={styles.checkboxesRow}>
          {monthDays.map((day) => {
            const dayNum = parseInt(day.split('-')[2], 10);
            const isBeforeCreation = day < habit.createdAt;
            const isToday = day === todayStr;
            const isPast = day < todayStr;
            const isFuture = day > todayStr;
            const isChecked = !!habit.completions[day];
            const isColumnSelected = day === selectedDay;

            let checkboxClass = styles.checkbox;
            if (isBeforeCreation) {
              checkboxClass += ` ${styles.checkboxDisabled}`;
            } else if (isToday) {
              checkboxClass += ` ${styles.checkboxToday}`;
            } else if (isPast) {
              checkboxClass += ` ${styles.checkboxPast}`;
            } else if (isFuture) {
              checkboxClass += ` ${styles.checkboxFuture}`;
            }
            if (isChecked) checkboxClass += ` ${styles.checked}`;
            if (pulsedDay === day) checkboxClass += ` ${styles.checkPulse}`;
            if (isColumnSelected) checkboxClass += ` ${styles.columnHighlight}`;

            const isInteractive = isToday && !isBeforeCreation;

            return (
              <button
                key={day}
                className={checkboxClass}
                disabled={!isInteractive}
                onClick={isInteractive ? () => {
                  if (!isChecked) {
                    setPulsedDay(day);
                    setTimeout(() => setPulsedDay(null), 400);
                  }
                  toggleCompletion(habit.id, day);
                } : undefined}
                title={`Day ${dayNum}`}
                aria-label={`Day ${dayNum} ${isChecked ? 'completed' : 'not completed'}`}
              >
                {isChecked && <span className={styles.checkmark}>✓</span>}
              </button>
            );
          })}
        </div>
      </td>

      {/* Column 5 — Mini progress bar + score */}
      <td className={styles.progressCell}>
        <div className={styles.progressWrapper}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className={styles.progressPct}>{score}%</span>
        </div>
      </td>
    </tr>
  );
}
