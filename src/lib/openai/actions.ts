/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import dbActivities from "../db/activities";
import dbUserSettings from "../db/userSettings";
import { mapActivitiesToRaw, mapRawActivities } from "../helpers/activitiesLib";
import { RawActivity, Activity } from "../helpers/types";
import { mapRawUserSettings } from "../helpers/userSettingsLib";
import { scheduleActivities } from "./scheduling";
import { DateTime } from "luxon";

export const scheduleActivitiesAction = async (
  dates: string[],
  prevData: unknown,
  formData: FormData
) => {
  console.log("scheduleActivitiesAction");
  console.log(dates);
  const datesFormatted = dates.map((date) => DateTime.fromISO(date));
  const activities: RawActivity[] = await dbActivities.getActivities();
  const mappedActivities: Activity[] = mapRawActivities(activities);
  const userSettings = await dbUserSettings.getSettings(1);
  const activityTypes = await dbActivities.getActivityTypes();
  const mappedUserSettings = mapRawUserSettings(userSettings, activityTypes);

  const scheduledActivities = await scheduleActivities(
    mappedActivities,
    activityTypes,
    mappedUserSettings.settings.activities.activityPriorities,
    datesFormatted.reduce(
      (acc, date) => {
        acc[date.toString()] = {
          dayOfWeek: date.toLocaleString({ weekday: "long" }),
          availableTimeInMinutes: 120,
        };
        return acc;
      },
      {} as {
        [day: string]: { dayOfWeek: string; availableTimeInMinutes: number };
      }
    )
  );
  if (!scheduledActivities) {
    throw new Error("No activities scheduled");
  }

  const scheduledActivitiesFormatted: Activity[] = scheduledActivities.map(
    (activity: (typeof scheduledActivities)[0], index: number) => {
      const type = activityTypes.find((type) => type.id === activity.typeId);
      if (!type) {
        throw new Error("Type not found");
      }
      return {
        id: index,
        date: DateTime.fromISO(activity.date),
        description: activity.description,
        duration: activity.duration,
        type: type,
        userDuration: 0,
      };
    }
  );
  const mappedScheduledActivities = mapActivitiesToRaw(
    scheduledActivitiesFormatted
  );
  await dbActivities.newActivities(mappedScheduledActivities);
  revalidatePath("/dashboard");

  return mappedScheduledActivities;
};
