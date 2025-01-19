/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { activities } from "./mockData";
import { Activity, UserSettings } from "./helpers/types";
import { userSettings } from "./mockData";
import dbActivities from "./db/activities";
import { ExtendedActivity } from "@/components/UserDurationForm";
import { mapRawActivities } from "./helpers/activitiesLib";
import dbUserSettings from "./db/userSettings";
import {
  mapRawUserSettings,
  mapUserSettingsToRaw,
} from "./helpers/userSettingsLib";

export async function getActivities(): Promise<Activity[]> {
  const activities = await dbActivities.getActivities();
  return mapRawActivities(activities);
}

export async function getActivitiesByDate(date: Date): Promise<Activity[]> {
  const activities = await dbActivities.getActivities();
  return mapRawActivities(activities).filter(
    (activity) => activity.date === date
  );
}

export async function saveActivities(
  newActivities: ExtendedActivity[],
  prevData: unknown,
  formData: FormData
) {
  const activities = await dbActivities.saveActivities(newActivities);
  const mappedActivities = mapRawActivities(activities);
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
