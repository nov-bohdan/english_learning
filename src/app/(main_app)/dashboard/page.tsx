import CalendarPage from "@/components/Calendar/CalendarPage";
import { mapRawActivities } from "@/lib/helpers/activitiesLib";
import dbActivities from "@/lib/db/activities";
import { Activity, RawActivity } from "@/lib/helpers/types";

export default async function Page() {
  const activities: RawActivity[] = await dbActivities.getActivities();
  const mappedActivities: Activity[] = mapRawActivities(activities);
  return <CalendarPage activities={mappedActivities} />;
}
