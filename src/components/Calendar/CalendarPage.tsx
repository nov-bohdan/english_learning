"use client";

import TodayDashboard from "../TodayDashboard";
import { Activity } from "../../lib/helpers/types";
import Calendar from "./Calendar";
import { useState } from "react";
import { normalizeDate } from "@/lib/dates";

export default function CalendarPage({
  activities,
}: {
  activities: Activity[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <div className="flex flex-col gap-4">
      <TodayDashboard
        todayActivities={
          activities.filter((activity) => {
            return (
              normalizeDate(activity.date).getTime() ===
              normalizeDate(selectedDate).getTime()
            );
          }) || []
        }
        selectedDate={selectedDate}
      />
      <Calendar
        activities={activities}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </div>
  );
}
