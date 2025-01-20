"use client";

import TodayDashboard from "../TodayDashboard";
import { Activity, RawActivity } from "../../lib/helpers/types";
import Calendar from "./Calendar";
import { useState } from "react";
import { DateTime } from "luxon";
import { mapRawActivities } from "@/lib/helpers/activitiesLib";

export default function CalendarPage({
  rawActivities,
  availableTimes,
}: {
  rawActivities: RawActivity[];
  availableTimes: number[];
}) {
  const activities: Activity[] = mapRawActivities(rawActivities);
  const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.now());
  return (
    <div className="flex flex-col gap-4">
      <TodayDashboard
        todayActivities={
          activities.filter((activity) => {
            return activity.date.hasSame(selectedDate, "day");
          }) || []
        }
        selectedDate={selectedDate}
      />
      <Calendar
        activities={activities}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        availableTimes={availableTimes}
      />
    </div>
  );
}
