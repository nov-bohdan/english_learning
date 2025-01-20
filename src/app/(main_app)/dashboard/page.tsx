import CalendarPage from "@/components/Calendar/CalendarPage";
import dbActivities from "@/lib/db/activities";
import { RawActivity } from "@/lib/helpers/types";

export default async function Page() {
  const activities: RawActivity[] = await dbActivities.getActivities();
  return <CalendarPage rawActivities={activities} />;
}
