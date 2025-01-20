import { Activity } from "@/lib/helpers/types";
import WeekDateCell from "./WeekDateCell";
import { DateTime } from "luxon";

export default function WeekView({
  activities,
  currentDay,
  currentWeek,
  selectedDate,
  handleClickOnDate,
  availableTimes,
}: {
  activities: Activity[];
  currentDay: number;
  currentWeek: DateTime[];
  selectedDate: DateTime;
  handleClickOnDate: (date: DateTime) => void;
  availableTimes: number[];
}) {
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  // console.log(currentWeek);
  return (
    <div className="flex flex-row">
      <div className="bg-white flex flex-col w-full">
        {currentWeek.map((day, index) => {
          const todayActivities = activities.filter((activity) =>
            activity.date.hasSame(currentWeek[index], "day")
          );
          return (
            <WeekDateCell
              key={index}
              day={`${day.day} (${daysOfWeek[day.weekday - 1]})`}
              availableTime={availableTimes[day.weekday - 1]}
              activities={todayActivities}
              isCurrentDay={currentWeek[index].day === currentDay}
              isSelectedDay={currentWeek[index].hasSame(selectedDate, "day")}
              onClick={() => handleClickOnDate(currentWeek[index])}
            />
          );
        })}
      </div>
    </div>
  );
}
