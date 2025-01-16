import CalendarComponent from "@/components/CalendarComponent";
import { getActivities } from "@/lib/actions";

export default async function Page() {
  const activities = await getActivities();
  return <CalendarComponent activities={activities} />;
}
