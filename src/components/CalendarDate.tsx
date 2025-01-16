import { Activity } from "@/lib/types";

export default function CalendarDate({
  date,
  activities,
}: {
  date: Date;
  activities: Activity[] | undefined;
}) {
  return (
    <div className="border border-gray-200 min-h-32 flex flex-col items-center p-4 gap-1">
      <p className="text-end w-full text-2xl font-bold">{date.getDate()}</p>
      {activities &&
        activities.map((activity) => (
          <div
            key={activity.id}
            className="w-full py-2 px-0.5 rounded-md text-xs"
            style={{ backgroundColor: activity.type.color }}
          >
            {activity.type.name} ({activity.duration} min)
          </div>
        ))}
      {activities &&
        activities.reduce((acc, activity) => acc + activity.duration, 0) >
          0 && (
          <p className="w-full bg-gray-200 rounded-md text-xs">
            Total:{" "}
            {activities.reduce((acc, activity) => acc + activity.duration, 0)}{" "}
            min
          </p>
        )}
    </div>
  );
}
