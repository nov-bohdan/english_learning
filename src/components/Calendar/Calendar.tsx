"use client";

import { getCalendar } from "@/lib/helpers/dates";
import { useEffect, useState } from "react";
import MonthView from "./CalendarViews/MonthView";
import { Activity } from "@/lib/helpers/types";
import WeekView from "./CalendarViews/WeekView";
import CalendarHeader from "./CalendarHeader";
import { DateTime } from "luxon";

const handleScreenSize = (setIsMobile: (isMobile: boolean) => void) => {
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
};

export default function Calendar({
  activities,
  selectedDate,
  setSelectedDate,
  availableTimes,
}: {
  activities: Activity[];
  selectedDate: DateTime;
  setSelectedDate: (date: DateTime) => void;
  availableTimes: number[];
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
  const [selectedMonth, setSelectedMonth] = useState<number>(
    DateTime.now().month
  );
  const [selectedYear, setSelectedYear] = useState<number>(DateTime.now().year);
  const currentDay = DateTime.now().day;
  const initialWeek = Array.from({ length: 7 }, (_, i) => {
    return DateTime.now().set({ day: currentDay - 3 + i });
  });
  const [currentWeek, setCurrentWeek] = useState<DateTime[]>(initialWeek);

  const dates = getCalendar();
  const firstDayOfMonth = DateTime.fromObject({
    year: selectedYear,
    month: selectedMonth,
    day: 1,
  }).weekday;

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    handleScreenSize(setIsMobile);
  }, []);

  const moveToPreviousWeek = () => {
    setCurrentWeek((currentWeek) => {
      const newWeek = currentWeek.map((day) => {
        return day.minus({ days: 7 });
      });
      if (newWeek[0].month !== selectedMonth) {
        setSelectedMonth(newWeek[0].month);
      }
      if (newWeek[0].year !== selectedYear) {
        setSelectedYear(newWeek[0].year);
      }
      return newWeek;
    });
  };

  const moveToNextWeek = () => {
    setCurrentWeek((currentWeek) => {
      const newWeek = currentWeek.map((day) => {
        return day.plus({ days: 7 });
      });
      if (newWeek[0].month !== selectedMonth) {
        setSelectedMonth(newWeek[0].month);
      }
      if (newWeek[0].year !== selectedYear) {
        setSelectedYear(newWeek[0].year);
      }
      return newWeek;
    });
  };

  const moveToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const moveToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleClickOnDate = (date: DateTime) => {
    setSelectedDate(date);
  };

  return (
    <div className="w-full flex flex-col mx-auto">
      {/* HEADER */}
      <CalendarHeader
        currentMonth={selectedMonth}
        currentYear={selectedYear}
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
          selectedDate={selectedDate}
          handleClickOnDate={handleClickOnDate}
          availableTimes={availableTimes}
        />
      ) : (
        <MonthView
          firstDayOfMonth={firstDayOfMonth}
          dates={dates}
          activities={activities}
          currentYear={selectedYear}
          currentMonth={selectedMonth}
          currentDay={currentDay}
          selectedDate={selectedDate}
          handleClickOnDate={handleClickOnDate}
          availableTimes={availableTimes}
        />
      )}
    </div>
  );
}
