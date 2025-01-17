/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { activities } from "./mockData";
import { Activity, UserSettings } from "./types";
import { userSettings } from "./mockData";

export async function getActivities(): Promise<Activity[]> {
  return activities;
}

export async function getActivitiesByDate(date: Date) {
  return activities.find((activity) => activity.date === date);
}

export async function saveActivities(
  newActivities: Activity[],
  prevData: unknown,
  formData: FormData
) {
  newActivities.forEach((newActivity) => {
    const index = activities.findIndex((a) => a.id === newActivity.id);
    activities[index] = newActivity;
  });

  revalidatePath("/dashboard");
  return activities;
}

export async function saveUserSettings(
  userId: number,
  settings: UserSettings,
  prevData: unknown,
  formData: FormData
) {
  userSettings.activities = settings.activities;
  revalidatePath("/settings");
  return userSettings;
}
