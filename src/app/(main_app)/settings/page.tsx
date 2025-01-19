import Settings from "@/components/Settings/Settings";
import dbUserSettings from "@/lib/db/userSettings";
import dbActivities from "@/lib/db/activities";
import { mapRawUserSettings } from "@/lib/helpers/userSettingsLib";

export default async function Page() {
  const userSettings = await dbUserSettings.getSettings(1);
  const activityTypes = await dbActivities.getActivityTypes();
  const mappedUserSettings = mapRawUserSettings(userSettings, activityTypes);
  return <Settings userSettings={mappedUserSettings} />;
}
