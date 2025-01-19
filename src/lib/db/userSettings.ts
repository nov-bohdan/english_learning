import { dbClient } from "./dbClient";
import { RawUserSettings } from "../types";

const client = dbClient.client;

export async function getSettings(userId: number): Promise<RawUserSettings> {
  const { data, error } = await client
    .from("user_settings")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  console.log(data[0]);
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

const dbUserSettings = {
  getSettings,
  saveSettings,
};

export default dbUserSettings;
