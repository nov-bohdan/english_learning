import { Activity } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type ExtendedActivity = Activity & {
  defaultUserDuration: string;
  isDraft: boolean;
};

export default function UserDurationForm({
  saveAction,
  activities,
  setActivities,
}: {
  saveAction: (formData: FormData) => void;
  activities: ExtendedActivity[];
  setActivities: Dispatch<SetStateAction<ExtendedActivity[]>>;
}) {
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(
    activities.some((activity) => activity.isDraft)
  );

  useEffect(() => {
    setUnsavedChanges(activities.some((activity) => activity.isDraft));
  }, [activities]);

  return (
    <form action={saveAction}>
      <div className="grid xl:grid-cols-3 grid-cols-2">
        {activities.map((activity) => (
          <div key={activity.id}>
            <p className="text-xs ">{activity.description}</p>
            <div
              className={`w-2/3 border-none outline-none p-2 rounded-md flex flex-row justify-between items-center gap-2 ${
                activities.find((a) => a.id === activity.id)?.isDraft
                  ? "bg-yellow-300"
                  : activities.find((a) => a.id === activity.id)
                      ?.userDuration &&
                    Number(
                      activities.find((a) => a.id === activity.id)?.userDuration
                    ) >= Number(activity.duration)
                  ? "bg-green-300"
                  : "bg-red-300"
              }`}
            >
              <div className="flex flex-row gap-1">
                <input
                  type="text"
                  value={
                    activities.find((a) => a.id === activity.id)
                      ?.userDuration || ""
                  }
                  onChange={(e) => {
                    setActivities(
                      activities.map((a) =>
                        a.id === activity.id
                          ? {
                              ...a,
                              userDuration: e.target.value,
                              isDraft:
                                e.target.value !== activity.defaultUserDuration,
                            }
                          : a
                      )
                    );
                  }}
                  className="w-2/3 bg-transparent border-none outline-none"
                />
                <p>/{activity.duration}</p>
              </div>
              <span className="text-xs">min</span>
            </div>
          </div>
        ))}
      </div>
      {unsavedChanges && (
        <button className="bg-blue-500 text-white p-2 rounded-md mt-2">
          Save
        </button>
      )}
    </form>
  );
}
