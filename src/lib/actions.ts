"use server";

import { revalidatePath } from "next/cache";
import { activities } from "./mockData";
import { Activity } from "./types";

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

  console.log("activities", activities);

  revalidatePath("/dashboard");
  return activities;
}
