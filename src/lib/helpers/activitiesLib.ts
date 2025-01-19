/* eslint-disable @typescript-eslint/no-unused-vars */
import { activityTypes } from "../mockData";
import { Activity, RawActivity } from "./types";

export function mapRawActivities(rawActivities: RawActivity[]): Activity[] {
  return rawActivities.map((rawActivity) => {
    const activityType = activityTypes.find(
      (type) => type.id === rawActivity.type_id
    );
    if (!activityType) {
      throw new Error("Activity type not found");
    }
    const { type_id, user_duration, ...rest } = rawActivity;
    return {
      ...rest,
      date: new Date(rawActivity.date),
      type: activityType,
      userDuration: user_duration,
    };
  });
}

export function mapActivitiesToRaw(activities: Activity[]): RawActivity[] {
  return activities.map((activity) => {
    const { type, userDuration, ...rest } = activity;
    return {
      ...rest,
      type_id: type.id,
      user_duration: userDuration,
      date: activity.date.toISOString(),
    };
  });
}
