import { dbClient } from "./dbClient";
import { RawUserSettings } from "../helpers/types";

const client = dbClient.client;

export async function getSettings(userId: number): Promise<RawUserSettings> {
  const { data, error } = await client
    .from("user_settings")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  return data[0] as RawUserSettings;
}

export async function saveSettings(
  settings: RawUserSettings
): Promise<RawUserSettings> {
  const { data, error } = await client
    .from("user_settings")
    .update({
      settings: settings.settings,
    })
    .eq("user_id", settings.user_id)
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data[0] as RawUserSettings;
}

export async function deleteActivityFromSettings(
  userId: number,
  activityId: number
) {
  const { data, error } = await client
    .from("user_settings")
    .select()
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  const settings = data[0] as RawUserSettings;
  delete settings.settings.activities.activityPriorities[activityId];
  const newSettings: RawUserSettings = {
    ...settings,
    settings: {
      ...settings.settings,
      activities: {
        activityPriorities: settings.settings.activities.activityPriorities,
        activityTypeIds: settings.settings.activities.activityTypeIds.filter(
          (id) => id !== activityId
        ),
      },
    },
  };
  await saveSettings(newSettings);
}

export async function addActivityToSettings(
  userId: number,
  activityId: number
) {
  const { data, error } = await client
    .from("user_settings")
    .select()
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }

  const settings = data[0] as RawUserSettings;
  settings.settings.activities.activityPriorities[activityId] = 1;
  settings.settings.activities.activityTypeIds.push(activityId);
  await saveSettings(settings);
}

const dbUserSettings = {
  getSettings,
  saveSettings,
  deleteActivityFromSettings,
  addActivityToSettings,
};

export default dbUserSettings;
