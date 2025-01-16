import { ActivityList } from "@/lib/types";

export default function CalendarDate({
  date,
  activities,
}: {
  date: Date;
  activities: ActivityList | undefined;
}) {
  return (
    <div className="border border-gray-200 h-36 flex flex-col justify-center items-center">
      {date.getDate()}
      {activities &&
        activities.activities.map((activity) => (
          <div key={activity.id}>{activity.name}</div>
        ))}
    </div>
  );
}
