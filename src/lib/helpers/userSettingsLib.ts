import { ActivityType, RawUserSettings, UserSettings } from "./types";

export function mapRawUserSettings(
  rawUserSettings: RawUserSettings,
  activityTypes: ActivityType[]
): UserSettings {
  console.log(rawUserSettings);
  console.log(activityTypes);
  const { settings, ...rest } = rawUserSettings;
  return {
    ...rest,
    userId: rawUserSettings.user_id,
    settings: {
      ...settings,
      activities: {
        ...settings.activities,
        activityTypes: settings.activities.activityTypeIds.map((id) => {
          const type = activityTypes.find((type) => type.id === id);
          if (!type) {
            throw new Error(`Activity type with id ${id} not found`);
          }
          return type;
        }),
      },
      availableTime: settings.availableTime,
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
      availableTime: settings.availableTime,
    },
  };
}
