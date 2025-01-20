/* eslint-disable @typescript-eslint/no-unused-vars */
import { dbClient } from "./dbClient";
import { Activity, ActivityType, RawActivity } from "../helpers/types";
import { ExtendedActivity } from "@/components/UserDurationForm";
import { revalidatePath } from "next/cache";
import { mapActivitiesToRaw } from "../helpers/activitiesLib";

const client = dbClient.client;

async function getActivities(): Promise<RawActivity[]> {
  const { data, error } = await client
    .from("activities")
    .select("*")
    .order("id", { ascending: true });
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
    const requests = [];
    for (const activity of activities) {
      if (!activity.isDraft) {
        savedActivities.push(mapActivitiesToRaw([activity])[0]);
        continue;
      }
      const { type, defaultUserDuration, isDraft, userDuration, ...rest } =
        activity;
      requests.push(
        client
          .from("activities")
          .update({
            ...rest,
            type_id: type.id,
            user_duration: Number(userDuration),
          })
          .eq("id", activity.id)
          .select()
      );
    }
    const responses = await Promise.all(requests);
    for (const response of responses) {
      if (response.error) {
        throw new Error(response.error.message);
      }
      savedActivities.push(...response.data);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error saving activities");
  }
  return savedActivities.sort((a, b) => a.id - b.id);
}

async function newActivities(activities: RawActivity[]) {
  const { data, error } = await client.from("activities").insert(
    activities.map((activity) => ({
      date: activity.date,
      description: activity.description,
      duration: activity.duration,
      type_id: activity.type_id,
      user_duration: activity.user_duration,
    }))
  );
  if (error) {
    throw new Error(error.message);
  }
  return data;
}

const dbActivities = {
  getActivities,
  getActivityTypes,
  saveActivities,
  newActivities,
};

export default dbActivities;
