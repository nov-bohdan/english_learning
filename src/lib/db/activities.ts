/* eslint-disable @typescript-eslint/no-unused-vars */
import { dbClient } from "./dbClient";
import { Activity, ActivityType, RawActivity } from "../types";
import { ExtendedActivity } from "@/components/UserDurationForm";
import { revalidatePath } from "next/cache";

const client = dbClient.client;

async function getActivities(): Promise<RawActivity[]> {
  const { data, error } = await client.from("activities").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as RawActivity[];
}

async function getActivityTypes(): Promise<ActivityType[]> {
  const { data, error } = await client.from("activity_types").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as ActivityType[];
}

async function saveActivities(activities: ExtendedActivity[]) {
  const savedActivities: RawActivity[] = [];
  try {
    for (const activity of activities) {
      const { type, defaultUserDuration, isDraft, userDuration, ...rest } =
        activity;
      const { data, error } = await client
        .from("activities")
        .update({
          ...rest,
          type_id: type.id,
          user_duration: Number(userDuration),
        })
        .eq("id", activity.id)
        .select();
      if (error) {
        throw new Error(error.message);
      }
      savedActivities.push(data[0]);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error saving activities");
  }
  return savedActivities;
}

const dbActivities = {
  getActivities,
  getActivityTypes,
  saveActivities,
};

export default dbActivities;
