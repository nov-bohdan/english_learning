import { Activity } from "@/lib/types";
import CalendarActivityList from "../CalendarActivityList";

export default function WeekDateCell({
  day,
  activities,
  isCurrentDay,
  isSelectedDay,
  onClick,
}: {
  day: string;
  activities: Activity[];
  isCurrentDay: boolean;
  isSelectedDay: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex flex-row gap-4 border border-gray-300 cursor-pointer ${
        isCurrentDay ? "bg-blue-100" : isSelectedDay ? "bg-orange-200" : ""
      } `}
      onClick={onClick}
    >
      <div
        className={` border-r border-gray-300 w-[30%] py-4 text-center px-6 font-bold flex flex-row items-center justify-center ${
          isCurrentDay ? "bg-blue-100" : "bg-gray-200"
        }`}
      >
        {day}
      </div>
      <div className="flex flex-col py-4 px-4 w-[70%]">
        <CalendarActivityList activities={activities} />
      </div>
    </div>
  );
}
