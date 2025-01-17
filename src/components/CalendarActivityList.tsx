import { Activity } from "@/lib/types";

export default function CalendarActivityList({
  activities,
}: {
  activities: Activity[];
}) {
  return (
    <div className="flex flex-col gap-1">
      {activities &&
        activities.map((activity) => (
          <div
            key={activity.id}
            className="w-full py-2 px-0.5 rounded-md text-xs text-center"
            style={{ backgroundColor: activity.type.color }}
          >
            {activity.type.name} ({activity.duration} min)
          </div>
        ))}
      {activities &&
        activities.reduce((acc, activity) => acc + activity.duration, 0) >
          0 && (
          <p className="w-full bg-gray-200 rounded-md text-xs text-center">
            Total:{" "}
            {activities.reduce((acc, activity) => acc + activity.duration, 0)}{" "}
            min
          </p>
        )}
    </div>
  );
}
