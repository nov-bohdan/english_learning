"use client";

import { getCalendar } from "@/lib/dates";
import { useEffect, useState } from "react";
import MonthView from "./CalendarViews/MonthView";
import { Activity } from "@/lib/types";
import WeekView from "./CalendarViews/WeekView";

export default function Calendar({ activities }: { activities: Activity[] }) {
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
  const currentDay = new Date().getDate();

  const dates = getCalendar();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1080);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full flex flex-col mx-auto">
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
      {isMobile ? (
        <WeekView
          activities={activities}
          currentYear={currentYear}
          currentMonth={currentMonth}
          currentDay={currentDay}
        />
      ) : (
        <MonthView
          firstDayOfMonth={firstDayOfMonth}
          dates={dates}
          activities={activities}
          currentYear={currentYear}
          currentMonth={currentMonth}
          currentDay={currentDay}
        />
      )}
    </div>
  );
}
