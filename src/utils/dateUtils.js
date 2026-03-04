import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getDaysInMonth,
  isBefore,
  startOfDay,
  parseISO,
  isSameMonth as dfnsSameMonth,
} from 'date-fns';

/**
 * Get all day strings for a given month.
 * @param {number} year  – e.g. 2026
 * @param {number} month – 0-indexed (0 = January)
 * @returns {string[]} array of 'YYYY-MM-DD'
 */
export function getMonthDays(year, month) {
  const numDays = getDaysInMonth(new Date(year, month));
  const days = [];
  for (let d = 1; d <= numDays; d++) {
    days.push(format(new Date(year, month, d), 'yyyy-MM-dd'));
  }
  return days;
}

/**
 * Get Mon–Sun date strings for the week containing `date`.
 * @param {Date} date
 * @returns {string[]}
 */
export function getWeekDays(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map((d) =>
    format(d, 'yyyy-MM-dd')
  );
}

/**
 * Format a Date to 'YYYY-MM-DD'.
 */
export function toDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Today as 'YYYY-MM-DD'.
 */
export function today() {
  return toDateString(new Date());
}

/**
 * Is the given date string strictly before today?
 */
export function isBeforeToday(dateString) {
  return isBefore(parseISO(dateString), startOfDay(new Date()));
}

/**
 * Is the given date string in the same month & year as today?
 */
export function isSameMonth(dateString) {
  return dfnsSameMonth(parseISO(dateString), new Date());
}

/**
 * Get an array of all date strings between two dates (inclusive).
 */
export function getDateRange(startDate, endDate) {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  if (isBefore(end, start)) return [];
  return eachDayOfInterval({ start, end }).map((d) => format(d, 'yyyy-MM-dd'));
}
