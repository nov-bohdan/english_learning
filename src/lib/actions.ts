import { activities } from "./mockData";

export async function getActivities() {
  return activities;
}

export async function getActivitiesByDate(date: Date) {
  return activities.find((activity) => activity.date === date);
}
