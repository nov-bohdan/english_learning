"use client";

import { getCalendar } from "@/lib/dates";
import { useEffect, useState } from "react";
import MonthView from "./CalendarViews/MonthView";
import { Activity } from "@/lib/types";
import WeekView from "./CalendarViews/WeekView";
import CalendarHeader from "./CalendarHeader";

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
  const initialWeek = [
    new Date(currentYear, currentMonth, currentDay - 3),
    new Date(currentYear, currentMonth, currentDay - 2),
    new Date(currentYear, currentMonth, currentDay - 1),
    new Date(currentYear, currentMonth, currentDay),
    new Date(currentYear, currentMonth, currentDay + 1),
    new Date(currentYear, currentMonth, currentDay + 2),
    new Date(currentYear, currentMonth, currentDay + 3),
  ];
  const [currentWeek, setCurrentWeek] = useState<Date[]>(initialWeek);

  const dates = getCalendar();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1080);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
    };
  }, []);

  const moveToPreviousWeek = () => {
    setCurrentWeek((currentWeek) => {
      const newWeek = currentWeek.map((day) => {
        return new Date(day.getFullYear(), day.getMonth(), day.getDate() - 7);
      });
      if (newWeek[0].getMonth() !== currentMonth) {
        setCurrentMonth(newWeek[0].getMonth());
      }
      if (newWeek[0].getFullYear() !== currentYear) {
        setCurrentYear(newWeek[0].getFullYear());
      }
      return newWeek;
    });
  };

  const moveToNextWeek = () => {
    setCurrentWeek((currentWeek) => {
      const newWeek = currentWeek.map((day) => {
        return new Date(day.getFullYear(), day.getMonth(), day.getDate() + 7);
      });
      if (newWeek[0].getMonth() !== currentMonth) {
        setCurrentMonth(newWeek[0].getMonth());
      }
      if (newWeek[0].getFullYear() !== currentYear) {
        setCurrentYear(newWeek[0].getFullYear());
      }
      return newWeek;
    });
  };

  const moveToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const moveToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="w-full flex flex-col mx-auto">
      {/* HEADER */}
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        isMobile={isMobile}
        currentWeek={currentWeek}
        months={months}
        moveToPreviousWeek={moveToPreviousWeek}
        moveToNextWeek={moveToNextWeek}
        moveToPreviousMonth={moveToPreviousMonth}
        moveToNextMonth={moveToNextMonth}
      />
      {/* MAIN */}
      {/* DAYS */}
      {isMobile ? (
        <WeekView
          activities={activities}
          currentDay={currentDay}
          currentWeek={currentWeek}
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
