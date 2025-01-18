import { Activity, Calendar } from "@/lib/types";
import CalendarDate from "../CalendarDate";

export default function MonthView({
  firstDayOfMonth,
  dates,
  activities,
  currentYear,
  currentMonth,
  currentDay,
}: {
  firstDayOfMonth: number;
  dates: Calendar;
  activities: Activity[];
  currentYear: number;
  currentMonth: number;
  currentDay: number;
}) {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  return (
    <div className="">
      <div className="bg-gray-200 flex flex-row justify-around items-start">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="border border-gray-300 w-full py-4 text-center"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="bg-gray-100 grid grid-cols-7 text-center">
        {/* Empty slots for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="border border-gray-200 py-10"
          ></div>
        ))}
        {/* DAYS */}
        {dates[currentYear][currentMonth].map((date) => {
          const todayActivities = activities.filter(
            (activity) => activity.date.toISOString() === date.toISOString()
          );
          return (
            <CalendarDate
              key={date.toISOString()}
              date={date}
              activities={todayActivities}
              isCurrentDay={new Date(date).getUTCDate() === currentDay}
            />
          );
        })}
      </div>
    </div>
  );
}
