import Settings from "@/components/Settings";
import { getUserSettings } from "@/lib/db/db";

export default async function Page() {
  const userSettings = await getUserSettings(1);
  return <Settings userSettings={userSettings} />;
}
