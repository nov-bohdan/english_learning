import { ActivityType, RawUserSettings, UserSettings } from "./types";

export function mapRawUserSettings(
  rawUserSettings: RawUserSettings,
  activityTypes: ActivityType[]
): UserSettings {
  return {
    ...rawUserSettings,
    userId: rawUserSettings.user_id,
    settings: {
      ...rawUserSettings.settings,
      activities: {
        ...rawUserSettings.settings.activities,
        activityTypes: rawUserSettings.settings.activities.activityTypeIds.map(
          (id) => {
            const type = activityTypes.find((type) => type.id === id);
            if (!type) {
              throw new Error(`Activity type with id ${id} not found`);
            }
            return type;
          }
        ),
      },
    },
  };
}

export function mapUserSettingsToRaw(
  userSettings: UserSettings
): RawUserSettings {
  const { settings, ...rest } = userSettings;
  return {
    ...rest,
    user_id: userSettings.userId,
    settings: {
      ...settings,
      activities: {
        activityPriorities: settings.activities.activityPriorities,
        activityTypeIds: settings.activities.activityTypes.map(
          (type) => type.id
        ),
      },
    },
  };
}
