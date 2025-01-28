/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import dbActivities from "../db/activities";
import dbUserSettings from "../db/userSettings";
import { mapActivitiesToRaw, mapRawActivities } from "../helpers/activitiesLib";
import { RawActivity, Activity, ActivityType } from "../helpers/types";
import { mapRawUserSettings } from "../helpers/userSettingsLib";
import { scheduleActivities } from "./scheduling";
import { DateTime } from "luxon";

type DaysToSchedule = {
  date: string;
  dayOfWeek: string;
  availableTimeInMinutes: number;
}[];

const isValidDate = (date: DateTime, validDates: DateTime[]) => {
  return validDates.some((validDate) => validDate.hasSame(date, "day"));
};

export const scheduleActivitiesAction = async (
  dates: string[],
  prevData: unknown,
  formData: FormData
) => {
  const scheduleInfo = formData.get("schedule_info") as string;
  const datesFormatted = dates.map((date) => DateTime.fromISO(date));
  const activities: RawActivity[] = await dbActivities.getActivities();
  const activityTypes: ActivityType[] = await dbActivities.getActivityTypes();
  const mappedActivities: Activity[] = mapRawActivities(
    activities,
    activityTypes
  );
  const userSettings = await dbUserSettings.getSettings(1);
  const mappedUserSettings = mapRawUserSettings(userSettings, activityTypes);

  const daysToSchedule: DaysToSchedule = datesFormatted.map((date) => {
    const dayOfWeek = date.weekdayLong || "";
    const availableTimeInMinutes =
      mappedUserSettings.settings.availableTime[date.weekday];
    return {
      date: date.toISO() || "",
      dayOfWeek,
      availableTimeInMinutes,
    };
  });

  const scheduledActivities = await scheduleActivities(
    mappedActivities,
    activityTypes,
    mappedUserSettings.settings.activities.activityPriorities,
    daysToSchedule,
    scheduleInfo
  );
  if (!scheduledActivities) {
    throw new Error("No activities scheduled");
  }

  const scheduledActivitiesFormatted: Activity[] = scheduledActivities.map(
    (activity: (typeof scheduledActivities)[0], index: number) => {
      if (!isValidDate(DateTime.fromISO(activity.date), datesFormatted)) {
        throw new Error("Activity date is not in the dates array");
      }
      const type = activityTypes.find((type) => type.id === activity.typeId);
      if (!type) {
        throw new Error("Type not found");
      }
      return {
        id: index,
        date: DateTime.fromISO(activity.date),
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
