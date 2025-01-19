import CalendarPage from "@/components/CalendarPage";
import { mapRawActivities } from "@/lib/activities";
import dbActivities from "@/lib/db/activities";
import { Activity, RawActivity } from "@/lib/types";

export default async function Page() {
  const activities: RawActivity[] = await dbActivities.getActivities();
  const mappedActivities: Activity[] = mapRawActivities(activities);
  return <CalendarPage activities={mappedActivities} />;
}
