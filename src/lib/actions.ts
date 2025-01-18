/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { activities } from "./mockData";
import { Activity, UserSettings } from "./types";
import { userSettings } from "./mockData";
import dbActivities from "./db/activities";
import { ExtendedActivity } from "@/components/UserDurationForm";
import { mapRawActivities } from "./activities";

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
) {
  userSettings.settings.activities = settings.settings.activities;
  revalidatePath("/settings");
  return userSettings;
}
