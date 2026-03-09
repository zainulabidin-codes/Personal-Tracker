import { useEffect } from 'react';
import useHabitStore from '../store/useHabitStore.js';

function formatToday() {
  const n = new Date();
  const y = n.getFullYear();
  const m = String(n.getMonth() + 1).padStart(2, '0');
  const d = String(n.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function useMidnightReset() {
  useEffect(() => {
    function msUntilMidnight() {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
      );
      return midnight - now;
    }

    let timer;

    function scheduleMidnightReset() {
      const delay = msUntilMidnight();
      timer = setTimeout(() => {
        useHabitStore.getState().setCurrentDate(formatToday());
        scheduleMidnightReset();
      }, delay);
    }

    scheduleMidnightReset();
    return () => clearTimeout(timer);
  }, []);
}
