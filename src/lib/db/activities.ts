import { dbClient } from "./dbClient";
import { ActivityType, RawActivity } from "../types";

const client = dbClient.client;

export async function getActivities(): Promise<RawActivity[]> {
  const { data, error } = await client.from("activities").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as RawActivity[];
}

export async function getActivityTypes(): Promise<ActivityType[]> {
  const { data, error } = await client.from("activity_types").select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data as ActivityType[];
}
