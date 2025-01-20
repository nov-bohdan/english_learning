import { Activity } from "@/lib/helpers/types";
import WeekDateCell from "./WeekDateCell";
import { normalizeDate } from "@/lib/helpers/dates";
import { DateTime } from "luxon";

export default function WeekView({
  activities,
  currentDay,
  currentWeek,
  selectedDate,
  handleClickOnDate,
}: {
  activities: Activity[];
  currentDay: number;
  currentWeek: DateTime[];
  selectedDate: DateTime;
  handleClickOnDate: (date: DateTime) => void;
}) {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="flex flex-row">
      <div className="bg-white flex flex-col w-full">
        {currentWeek.map((day, index) => {
          const todayActivities = activities.filter(
            (activity) =>
              normalizeDate(activity.date).getTime() ===
              normalizeDate(currentWeek[index]).getTime()
          );
          return (
            <WeekDateCell
              key={index}
              day={`${day.day} (${daysOfWeek[day.weekday]})`}
              activities={todayActivities}
              isCurrentDay={currentWeek[index].day === currentDay}
              isSelectedDay={
                normalizeDate(currentWeek[index]).getTime() ===
                normalizeDate(selectedDate).getTime()
              }
              onClick={() => handleClickOnDate(currentWeek[index])}
            />
          );
        })}
      </div>
    </div>
  );
}
