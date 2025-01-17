import Calendar from "@/components/Calendar";
import TodayDashboard from "@/components/TodayDashboard";
import { getActivities } from "@/lib/actions";

export default async function Page() {
  const activities = await getActivities();
  return (
    <div className="flex flex-col gap-4">
      <TodayDashboard
        todayActivities={
          activities.filter(
            (activity) =>
              activity.date.setHours(0, 0, 0, 0) ===
              new Date().setHours(0, 0, 0, 0)
          ) || []
        }
      />
      <Calendar activities={activities} />
    </div>
  );
}
