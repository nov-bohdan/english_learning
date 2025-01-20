import { DateTime } from "luxon";

export default function CalendarHeader({
  currentMonth,
  currentYear,
  isMobile,
  currentWeek,
  months,
  moveToPreviousWeek,
  moveToNextWeek,
  moveToPreviousMonth,
  moveToNextMonth,
}: {
  currentMonth: number;
  currentYear: number;
  isMobile: boolean;
  currentWeek: DateTime[];
  months: string[];
  moveToPreviousWeek: () => void;
  moveToNextWeek: () => void;
  moveToPreviousMonth: () => void;
  moveToNextMonth: () => void;
}) {
  return (
    <div className="bg-gray-300 flex flex-row justify-between items-start p-4">
      <div
        className="cursor-pointer"
        onClick={isMobile ? moveToPreviousWeek : moveToPreviousMonth}
      >
        PREVIOUS
      </div>
      <div className="">
        {months[currentMonth - 1]}{" "}
        {isMobile
          ? `${currentWeek[0].day} - ${currentWeek[6].day}`
          : `| ${currentYear}`}
      </div>
      <div
        className="cursor-pointer"
        onClick={isMobile ? moveToNextWeek : moveToNextMonth}
      >
        NEXT
      </div>
    </div>
  );
}
