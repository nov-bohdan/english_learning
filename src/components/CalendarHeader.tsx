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
  currentWeek: Date[];
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
        {months[currentMonth]}{" "}
        {isMobile
          ? `${currentWeek[0].getDate()} - ${currentWeek[6].getDate()}`
          : ""}{" "}
        | {currentYear}
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
