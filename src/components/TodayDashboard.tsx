"use client";

import { saveActivities } from "@/lib/actions";
import { Activity } from "@/lib/types";
import { useActionState, useEffect, useState } from "react";
import UserDurationForm, { ExtendedActivity } from "./UserDurationForm";

export default function TodayDashboard({
  todayActivities,
}: {
  todayActivities: Activity[];
}) {
  const [activities, setActivities] = useState<ExtendedActivity[]>(
    todayActivities.map((activity) => ({
      ...activity,
      defaultUserDuration: activity.userDuration,
      isDraft: false,
    }))
  );
  const [saveState, saveAction] = useActionState(
    saveActivities.bind(null, activities),
    null
  );

  useEffect(() => {
    if (saveState) {
      setActivities(
        saveState.map((activity: Activity) => ({
          ...activity,
          defaultUserDuration: activity.userDuration,
          isDraft: false,
        }))
      );
    }
  }, [saveState]);

  const handleSetDuration = (activity: ExtendedActivity, duration: string) => {
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
          <p className="text-xl">Today is {new Date().toLocaleDateString()}</p>
          <p className="text-xl">
            You have {todayActivities.length} activities today
          </p>
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
                  {activity.description} ({activity.duration} min)
                </p>
              </div>
            ))}
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
        />
      </div>
    </div>
  );
}
