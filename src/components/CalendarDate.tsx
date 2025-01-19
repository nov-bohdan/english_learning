import { Activity } from "@/lib/types";
import CalendarActivityList from "./CalendarActivityList";

export default function CalendarDate({
  date,
  activities,
  isCurrentDay,
  isSelectedDay,
  onClick,
}: {
  date: Date;
  activities: Activity[] | undefined;
  isCurrentDay: boolean;
  isSelectedDay: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`border border-gray-200 min-h-32 p-4 cursor-pointer ${
        isCurrentDay ? "bg-blue-100" : isSelectedDay ? "bg-orange-100" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-1">
        <p className="text-end w-full text-2xl font-bold">
          {date.getUTCDate()}
        </p>
        {activities && <CalendarActivityList activities={activities || []} />}
      </div>
    </div>
  );
}
