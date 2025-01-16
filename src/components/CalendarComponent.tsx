"use client";

import { getCalendar } from "@/lib/dates";
import { useState } from "react";
import { ActivityList } from "@/lib/types";
import CalendarDate from "./CalendarDate";

export default function CalendarComponent({
  activities,
}: {
  activities: ActivityList[];
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );

  const dates = getCalendar();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  return (
    <div className="w-[70%] flex flex-col mx-auto">
      {/* HEADER */}
      <div className="bg-gray-300 flex flex-row justify-between items-start p-4">
        <div
          className="cursor-pointer"
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentMonth(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
        >
          LEFT
        </div>
        <div className="">
          {months[currentMonth]} {currentYear}
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentMonth(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
        >
          RIGHT
        </div>
      </div>
      {/* MAIN */}
      {/* DAYS */}
      <div className="bg-gray-200 flex flex-row justify-around items-start">
        <div className="border border-gray-300 w-full py-4 text-center">S</div>
        <div className="border border-gray-300 w-full py-4 text-center">M</div>
        <div className="border border-gray-300 w-full py-4 text-center">T</div>
        <div className="border border-gray-300 w-full py-4 text-center">W</div>
        <div className="border border-gray-300 w-full py-4 text-center">T</div>
        <div className="border border-gray-300 w-full py-4 text-center">F</div>
        <div className="border border-gray-300 w-full py-4 text-center">S</div>
      </div>
      <div className="bg-gray-100 grid grid-cols-7 text-center">
        {/* Empty slots for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="border border-gray-200 py-10"
          ></div>
        ))}
        {/* DAYS */}
        {dates[currentYear][currentMonth].map((date) => {
          const todayActivities = activities.find(
            (activity) => activity.date === date
          );
          console.log(todayActivities);
          return (
            <CalendarDate
              key={date.toISOString()}
              date={date}
              activities={todayActivities}
            />
          );
        })}
      </div>
    </div>
  );
}
