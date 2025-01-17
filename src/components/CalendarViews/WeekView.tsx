import { Activity } from "@/lib/types";
import WeekDateCell from "./WeekDateCell";

export default function WeekView({
  activities,
  currentYear,
  currentMonth,
  currentDay,
}: {
  activities: Activity[];
  currentYear: number;
  currentMonth: number;
  currentDay: number;
}) {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const datesForTable = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(currentYear, currentMonth, currentDay - 3 + index);
    return date;
  });
  const daysForTable = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(currentYear, currentMonth, currentDay - 3 + index);
    const dayOfWeek = date.getDay();
    return `${date.getDate()} (${daysOfWeek[dayOfWeek]})`;
  });

  return (
    <div className="flex flex-row">
      <div className="bg-white flex flex-col w-full">
        {daysForTable.map((day, index) => {
          const todayActivities = activities.filter(
            (activity) =>
              activity.date.setHours(0, 0, 0, 0) ===
              datesForTable[index].setHours(0, 0, 0, 0)
          );
          return (
            <WeekDateCell
              key={index}
              day={day}
              activities={todayActivities}
              isCurrentDay={datesForTable[index].getDate() === currentDay}
            />
          );
        })}
      </div>
    </div>
  );
}
