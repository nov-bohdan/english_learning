import { Activity } from "@/lib/types";
import WeekDateCell from "./WeekDateCell";

export default function WeekView({
  activities,
  currentDay,
  currentWeek,
}: {
  activities: Activity[];
  currentDay: number;
  currentWeek: Date[];
}) {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="flex flex-row">
      <div className="bg-white flex flex-col w-full">
        {currentWeek.map((day, index) => {
          const todayActivities = activities.filter(
            (activity) =>
              activity.date.getUTCDate() === currentWeek[index].getUTCDate()
          );
          return (
            <WeekDateCell
              key={index}
              day={`${day.getUTCDate()} (${daysOfWeek[day.getDay()]})`}
              activities={todayActivities}
              isCurrentDay={currentWeek[index].getUTCDate() === currentDay}
            />
          );
        })}
      </div>
    </div>
  );
}
