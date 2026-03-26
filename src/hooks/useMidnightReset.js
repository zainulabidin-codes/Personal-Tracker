import { useEffect } from 'react';
import useHabitStore from '../store/useHabitStore.js';
import { today } from '../utils/dateUtils.js';

export function useMidnightReset() {
  useEffect(() => {
    function checkDate() {
      const nowString = today();
      if (useHabitStore.getState().currentDate !== nowString) {
        useHabitStore.getState().setCurrentDate(nowString);
      }
    }

    // Check immediately on mount
    checkDate();

    // Set an interval to check every minute to handle sleep/wake and long-running tabs
    const interval = setInterval(checkDate, 60000);

    return () => clearInterval(interval);
  }, []);
}