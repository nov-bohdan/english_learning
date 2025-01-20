"use client";

import { saveActivities } from "@/lib/actions";
import { Activity } from "@/lib/helpers/types";
import { useActionState, useEffect, useState } from "react";
import UserDurationForm, { ExtendedActivity } from "./UserDurationForm";
import { scheduleActivitiesAction } from "@/lib/openai/actions";
import { DateTime } from "luxon";

export default function TodayDashboard({
  todayActivities,
  selectedDate,
}: {
  todayActivities: Activity[];
  selectedDate: DateTime;
}) {
  const [, scheduleAction, scheduleIsPending] = useActionState(
    scheduleActivitiesAction.bind(null, [selectedDate.toString()]),
    undefined
  );

  const [activities, setActivities] = useState<ExtendedActivity[]>(
    todayActivities.map((activity) => ({
      ...activity,
      date: activity.date.toISO() || "",
      defaultUserDuration: activity.userDuration,
      isDraft: false,
    }))
  );

  useEffect(() => {
    setActivities(
      todayActivities.map((activity) => ({
        ...activity,
        defaultUserDuration: activity.userDuration,
        isDraft: false,
        date: activity.date.toISO() || "",
      }))
    );
  }, [todayActivities]);

  const [saveState, saveAction, isPending] = useActionState(
    saveActivities.bind(null, activities),
    undefined
  );

  useEffect(() => {
    if (saveState) {
      setActivities(
        saveState.map((activity: Activity) => ({
          ...activity,
          defaultUserDuration: activity.userDuration,
          isDraft: false,
          date: activity.date.toISO() || "",
        }))
      );
    }
  }, [saveState]);

  const handleSetDuration = (activity: ExtendedActivity, duration: number) => {
    setActivities(
      activities.map((a) =>
        a.id === activity.id
          ? {
              ...a,
              userDuration: duration,
              isDraft: duration !== activity.defaultUserDuration,
            }
          : a
      )
    );
  };

  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(
    activities.some((activity) => activity.isDraft)
  );

  useEffect(() => {
    setUnsavedChanges(activities.some((activity) => activity.isDraft));
  }, [activities]);

  return (
    <div className="flex flex-row gap-4 w-full">
      <div className="w-1/2 lg:w-2/3 bg-gray-200 rounded-md p-4">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-xl">
            You selected {selectedDate.toLocaleString()}
          </p>
          <p className="text-xl">
            You have {todayActivities.length} activities today
          </p>
          {todayActivities.length === 0 && (
            <form action={scheduleAction}>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={scheduleIsPending}
              >
                Schedule activities
              </button>
            </form>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-xs gap-1">
            {todayActivities.map((activity) => (
              <div key={activity.id}>
                <p
                  className="w-full py-2 px-2 rounded-md text-xs"
                  style={{
                    backgroundColor:
                      Number(activity.userDuration) >= Number(activity.duration)
                        ? "#77DD77"
                        : "#FFB6C1",
                  }}
                >
                  {activity.type.name}{" "}
                  <span className="font-semibold">
                    ({activity.userDuration} / {activity.duration} min)
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2 text-left w-full text-sm">
            <p className="">
              Total time spent:{" "}
              {todayActivities.reduce(
                (acc, activity) => acc + Number(activity.userDuration),
                0
              )}{" "}
              min
            </p>
            <p className="">
              Total time remaining:{" "}
              {todayActivities.reduce(
                (acc, activity) => acc + Number(activity.duration),
                0
              )}{" "}
              min
            </p>
            <p className="">
              Completed activities:{" "}
              {
                todayActivities.filter(
                  (activity) =>
                    Number(activity.userDuration) >= Number(activity.duration)
                ).length
              }{" "}
              / {todayActivities.length}
            </p>
          </div>
        </div>
      </div>

      <div className="w-1/2 lg:w-1/3 bg-gray-200 rounded-md p-4 flex flex-col items-center">
        <p className="text-xl">How much time did you spend?</p>
        <UserDurationForm
          saveAction={saveAction}
          activities={activities}
          handleSetDuration={handleSetDuration}
          unsavedChanges={unsavedChanges}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
