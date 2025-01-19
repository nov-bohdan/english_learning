import { Activity } from "@/lib/helpers/types";

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
            style={{
              backgroundColor:
                Number(activity.userDuration) >= Number(activity.duration)
                  ? "#77DD77"
                  : "#FFB6C1",
            }}
          >
            {activity.type.name}{" "}
            <span className="font-semibold">
              ({activity.userDuration} / {activity.duration} min)
            </span>
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
