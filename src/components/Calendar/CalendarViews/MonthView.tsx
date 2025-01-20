import { Activity, Calendar } from "@/lib/helpers/types";
import CalendarDate from "../CalendarDate";
import { DateTime } from "luxon";

export default function MonthView({
  firstDayOfMonth,
  dates,
  activities,
  currentYear,
  currentMonth,
  currentDay,
  selectedDate,
  handleClickOnDate,
  availableTimes,
}: {
  firstDayOfMonth: number;
  dates: Calendar;
  activities: Activity[];
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  selectedDate: DateTime;
  handleClickOnDate: (date: DateTime) => void;
  availableTimes: number[];
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
            {day} ({availableTimes[index]} min)
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
          const todayActivities = activities.filter((activity) => {
            try {
              return activity.date.hasSame(date, "day");
            } catch (error) {
              console.log(error);
              console.log(activity.date);
              console.log(date);
              return false;
            }
          });
          return (
            <CalendarDate
              key={date.toString()}
              date={date}
              activities={todayActivities}
              isCurrentDay={date.day === currentDay}
              isSelectedDay={date.hasSame(selectedDate, "day")}
              onClick={() => handleClickOnDate(date)}
            />
          );
        })}
      </div>
    </div>
  );
}
