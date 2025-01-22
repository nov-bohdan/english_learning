/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { Activity, UserSettings } from "./helpers/types";
import dbActivities from "./db/activities";
import { ExtendedActivity } from "@/components/Calendar/UserDurationForm";
import { mapRawActivities } from "./helpers/activitiesLib";
import dbUserSettings from "./db/userSettings";
import {
  mapRawUserSettings,
  mapUserSettingsToRaw,
} from "./helpers/userSettingsLib";

export async function saveActivities(
  newActivities: ExtendedActivity[],
  prevData: unknown,
  formData: FormData
) {
  const activities = await dbActivities.saveActivities(newActivities);
  const activityTypes = await dbActivities.getActivityTypes();
  const mappedActivities = mapRawActivities(activities, activityTypes).map(
    (activity) => ({
      ...activity,
      date: activity.date.toISO() || "",
    })
  );
  revalidatePath("/dashboard");
  return mappedActivities;
}

export async function saveUserSettings(
  userId: number,
  settings: UserSettings,
  prevData: unknown,
  formData: FormData
): Promise<UserSettings> {
  const rawSettings = mapUserSettingsToRaw(settings);
  const savedSettings = await dbUserSettings.saveSettings(rawSettings);
  const activityTypes = await dbActivities.getActivityTypes();
  const mappedSettings = mapRawUserSettings(savedSettings, activityTypes);
  revalidatePath("/settings");
  return mappedSettings;
}

export async function saveNewActivity(
  userId: number,
  prevData: unknown,
  formData: FormData
) {
  const activityName = formData.get("activity_name")?.toString();
  if (!activityName) {
    throw new Error("Activity name is required");
  }

  const newActivity = await dbActivities.addActivityType({
    id: 0,
    name: activityName,
  });
  await dbUserSettings.addActivityToSettings(userId, newActivity.id);
  revalidatePath("/settings");
  return newActivity;
}
