import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  parseISO,
  isValid
} from 'date-fns';

// ─────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────

/**
 * Safe today — strips time component, local timezone only.
 * Returns a Date at midnight local time.
 */
function localToday() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/**
 * Format any Date to 'yyyy-MM-dd' string.
 */
function toKey(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Returns all calendar days of a given month as 'yyyy-MM-dd' strings.
 * Works for ANY month of ANY year.
 *
 * @param {Date} referenceDate - any date within the target month
 * @returns {string[]} e.g. ['2026-02-01', ..., '2026-02-28'] for Feb 2026
 */
function getAllDaysInMonth(referenceDate) {
  const first = startOfMonth(referenceDate);
  const last  = endOfMonth(referenceDate);
  return eachDayOfInterval({ start: first, end: last })
    .map(d => toKey(d));
}

// ─────────────────────────────────────────
// EXPORTED SCORE FUNCTIONS
// ─────────────────────────────────────────

/**
 * Per-habit monthly score.
 *
 * Denominator = getDaysInMonth(referenceDate)
 *   Jan=31, Feb=28/29, Mar=31, Apr=30, etc.
 *   This value is DERIVED from date-fns every time — never hardcoded.
 *
 * Numerator = number of days in that month where habit was completed.
 *
 * Score = (numerator / denominator) × 100  → rounded integer 0–100
 *
 * @param {object} habit - habit object with completions map
 * @param {Date}   referenceDate - defaults to today, pass any date
 *                                 to score a different month
 */
export function getHabitMonthlyScore(habit, referenceDate = new Date()) {
  // denominator: total days in the month — dynamic, never hardcoded
  const denominator = getDaysInMonth(referenceDate);
  // all days of that month as date strings
  const allDays = getAllDaysInMonth(referenceDate);

  // count how many days this habit was completed in that month
  const checkedCount = allDays.filter(
    dateStr => habit.completions?.[dateStr] === true
  ).length;

  const raw = (checkedCount / denominator) * 100;
  return Math.min(100, Math.max(0, Math.round(raw)));
}

/**
 * Overall score for ALL habits on a single specific date.
 * Returns integer 0–100.
 *
 * @param {object[]} habits
 * @param {string}   dateStr - 'yyyy-MM-dd'
 */
export function getDailyScore(habits, dateStr) {
  if (!habits?.length) return 0;
  const checked = habits.filter(
    h => h.completions?.[dateStr] === true
  ).length;
  return Math.round((checked / habits.length) * 100);
}

/**
 * Average daily score over an array of date strings.
 * Automatically excludes future dates.
 *
 * @param {object[]} habits
 * @param {string[]} dateStrings - array of 'yyyy-MM-dd'
 */
export function getPeriodScore(habits, dateStrings) {
  if (!habits?.length || !dateStrings?.length) return 0;
  const todayStr = toKey(localToday());
  const validDays = dateStrings.filter(d => d <= todayStr);
  if (!validDays.length) return 0;
  const sum = validDays.reduce(
    (acc, d) => acc + getDailyScore(habits, d), 0
  );
  return Math.round(sum / validDays.length);
}

/**
 * Current streak: consecutive days going back from today
 * where at least one habit was completed.
 * Returns integer.
 */
export function getStreakCount(habits) {
  if (!habits?.length) return 0;
  let streak = 0;
  const cursor = localToday();
  for (let i = 0; i < 366; i++) {
    const key = toKey(cursor);
    if (getDailyScore(habits, key) === 0) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/**
 * Best ever streak across all recorded history.
 * Returns integer.
 */
export function getBestStreak(habits) {
  if (!habits?.length) return 0;
  const dates = habits
    .map(h => h.createdAt)
    .filter(d => d && isValid(parseISO(d)))
    .sort();
  if (!dates.length) return 0;

  const start = parseISO(dates[0]);
  const end   = localToday();
  const allDays = eachDayOfInterval({ start, end });

  let best = 0, current = 0;
  for (const day of allDays) {
    const key = toKey(day);
    if (getDailyScore(habits, key) > 0) {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }
  return best;
}

/**
 * Monthly score across ALL habits for a given month.
 * Average of getHabitMonthlyScore across all habits.
 *
 * @param {object[]} habits
 * @param {Date}     referenceDate - any date in the target month
 */
export function getOverallMonthlyScore(habits, referenceDate = new Date()) {
  if (!habits?.length) return 0;
  const sum = habits.reduce(
    (acc, h) => acc + getHabitMonthlyScore(h, referenceDate), 0
  );
  return Math.round(sum / habits.length);
}

// ─────────────────────────────────────────
// STATS HELPERS (used by StatsSection)
// ─────────────────────────────────────────

/**
 * Total number of completions ever across all habits.
 */
export function getTotalCompletions(habits) {
  return habits.reduce(
    (sum, h) => sum + Object.values(h.completions).filter(Boolean).length,
    0
  );
}

/**
 * Get the habit with the highest all-time completion percentage.
 */
export function getMostConsistentHabit(habits) {
  if (!habits?.length) return null;

  let best = null;
  let bestPct = -1;

  for (const habit of habits) {
    if (!habit.createdAt || !isValid(parseISO(habit.createdAt))) continue;
    const start = parseISO(habit.createdAt);
    const end = localToday();
    const allDays = eachDayOfInterval({ start, end }).map(d => toKey(d));
    if (!allDays.length) continue;
    const completed = allDays.filter(d => habit.completions[d]).length;
    const pct = Math.round((completed / allDays.length) * 100);
    if (pct > bestPct) {
      bestPct = pct;
      best = { ...habit, pct };
    }
  }
  return best;
}

/**
 * Monthly average scores for all months from earliest habit to now.
 * Returns [{ month: 'Jan 2026', score: 74 }, ...]
 */
export function getMonthlyAverages(habits) {
  if (!habits?.length) return [];
  const dates = habits
    .map(h => h.createdAt)
    .filter(d => d && isValid(parseISO(d)))
    .sort();
  if (!dates.length) return [];

  const earliest = parseISO(dates[0]);
  const now = localToday();
  const todayStr = toKey(now);
  const results = [];

  let cursor = new Date(earliest.getFullYear(), earliest.getMonth(), 1);

  while (
    cursor.getFullYear() < now.getFullYear() ||
    (cursor.getFullYear() === now.getFullYear() &&
      cursor.getMonth() <= now.getMonth())
  ) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const refDate = new Date(year, month, 1);
    const allDays = getAllDaysInMonth(refDate).filter(d => d <= todayStr);

    if (allDays.length) {
      const total = allDays.reduce(
        (s, d) => s + getDailyScore(habits, d),
        0
      );
      results.push({
        month: format(new Date(year, month, 1), 'MMM yyyy'),
        score: Math.round(total / allDays.length),
      });
    }
    cursor = new Date(year, month + 1, 1);
  }
  return results;
}
