/* eslint-disable @typescript-eslint/no-unused-vars */
import { dbClient } from "./dbClient";
import { Activity, ActivityType, RawActivity } from "../helpers/types";
import { ExtendedActivity } from "@/components/Calendar/UserDurationForm";
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
  return data;
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
            date: activity.date,
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

async function deleteActivityType(id: number) {
  const { error } = await client.from("activity_types").delete().eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

async function addActivityType(
  activityType: ActivityType
): Promise<ActivityType> {
  const { data, error } = await client
    .from("activity_types")
    .insert({
      name: activityType.name,
    })
    .select();
  if (error) {
    throw new Error(error.message);
  }
  return data[0];
}

const dbActivities = {
  getActivities,
  getActivityTypes,
  saveActivities,
  newActivities,
  deleteActivityType,
  addActivityType,
};

export default dbActivities;
