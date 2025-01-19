import Settings from "@/components/Settings";
import dbUserSettings from "@/lib/db/userSettings";
import { mapRawUserSettings } from "@/lib/userSettingsLib";

export default async function Page() {
  const userSettings = await dbUserSettings.getSettings(1);
  const mappedUserSettings = mapRawUserSettings(userSettings);
  return <Settings userSettings={mappedUserSettings} />;
}
