/* eslint-disable @typescript-eslint/no-unused-vars */
import { ExtendedActivity } from "@/components/Calendar/UserDurationForm";
import { Activity, ActivityType, RawActivity } from "./types";
import { DateTime } from "luxon";

export function mapRawActivities(
  rawActivities: RawActivity[],
  activityTypes: ActivityType[]
): Activity[] {
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
      date: DateTime.fromISO(rawActivity.date),
      type: activityType,
      userDuration: user_duration,
    };
  });
}

export function mapActivitiesToRaw(
  activities: ExtendedActivity[] | Activity[]
): RawActivity[] {
  return activities.map((activity) => {
    const { type, userDuration, ...rest } = activity;
    return {
      ...rest,
      type_id: type.id,
      user_duration: userDuration,
      date:
        typeof activity.date === "string"
          ? activity.date
          : activity.date.toISO() || "",
    };
  });
}
