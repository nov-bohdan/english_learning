import CalendarPage from "@/components/Calendar/CalendarPage";
import dbActivities from "@/lib/db/activities";
import dbUserSettings from "@/lib/db/userSettings";
import { RawActivity, RawUserSettings } from "@/lib/helpers/types";

export default async function Page() {
  const activities: RawActivity[] = await dbActivities.getActivities();
  const userSettings: RawUserSettings = await dbUserSettings.getSettings(1);
  const availableTimes = Object.values(userSettings.settings.availableTime);

  return (
    <CalendarPage rawActivities={activities} availableTimes={availableTimes} />
  );
}
