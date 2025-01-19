import { RawUserSettings, UserSettings } from "./types";

export function mapRawUserSettings(rawUserSettings: RawUserSettings) {
  return {
    ...rawUserSettings,
    userId: rawUserSettings.user_id,
  };
}

export function mapUserSettingsToRaw(userSettings: UserSettings) {
  return {
    ...userSettings,
    user_id: userSettings.userId,
  };
}
