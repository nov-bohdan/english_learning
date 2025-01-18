import Calendar from "@/components/Calendar";
import TodayDashboard from "@/components/TodayDashboard";
import { mapRawActivities } from "@/lib/activities";
import dbActivities from "@/lib/db/activities";
import { Activity, RawActivity } from "@/lib/types";

export default async function Page() {
  const activities: RawActivity[] = await dbActivities.getActivities();
  const mappedActivities: Activity[] = mapRawActivities(activities);
  const today = new Date().getDate();
  return (
    <div className="flex flex-col gap-4">
      <TodayDashboard
        todayActivities={
          mappedActivities.filter(
            (activity) => activity.date.getUTCDate() === today
          ) || []
        }
      />
      <Calendar activities={mappedActivities} />
    </div>
  );
}
