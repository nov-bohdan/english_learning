export function getCalendar() {
  const dates: { [key: string]: { [key: string]: Date[] } } = {};
  for (let year = 2024; year <= 2025; year++) {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        if (!dates[date.getFullYear()]) {
          dates[date.getFullYear()] = {};
        }
        if (!dates[date.getFullYear()][date.getMonth()]) {
          dates[date.getFullYear()][date.getMonth()] = [];
        }
        dates[date.getFullYear()][date.getMonth()].push(date);
      }
    }
  }
  return dates;
}
