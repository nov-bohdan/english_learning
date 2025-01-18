import { Calendar } from "./types";

export function getCalendar(): Calendar {
  const dates: { [key: string]: { [key: string]: Date[] } } = {};
  for (let year = 2024; year <= 2025; year++) {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(Date.UTC(year, month, day));
        if (!dates[date.getUTCFullYear()]) {
          dates[date.getUTCFullYear()] = {};
        }
        if (!dates[date.getUTCFullYear()][date.getUTCMonth()]) {
          dates[date.getUTCFullYear()][date.getUTCMonth()] = [];
        }
        dates[date.getUTCFullYear()][date.getUTCMonth()].push(date);
      }
    }
  }
  return dates;
}
