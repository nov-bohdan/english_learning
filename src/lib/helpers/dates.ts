import { Calendar } from "./types";
import { DateTime } from "luxon";

export function getCalendar(): Calendar {
  const dates: { [key: string]: { [key: string]: DateTime[] } } = {};
  for (let year = 2024; year <= 2025; year++) {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = DateTime.fromObject({ year, month, day: 1 }).endOf(
        "month"
      ).day;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = DateTime.fromObject({ year, month, day });
        if (!dates[date.year]) {
          dates[date.year] = {};
        }
        if (!dates[date.year][date.month]) {
          dates[date.year][date.month] = [];
        }
        dates[date.year][date.month].push(date);
      }
    }
  }
  return dates;
}

export function normalizeDate(date: DateTime) {
  const normalized = DateTime.fromObject({
    year: date.year,
    month: date.month,
    day: date.day,
  });
  return normalized;
}
