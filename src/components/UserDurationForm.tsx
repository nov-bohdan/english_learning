import { Activity } from "@/lib/types";

export type ExtendedActivity = Activity & {
  defaultUserDuration: string;
  isDraft: boolean;
};

const determineColor = (
  activities: ExtendedActivity[],
  activity: ExtendedActivity
) => {
  if (activity.isDraft) {
    return "bg-yellow-300";
  }

  if (
    activities.find((a) => a.id === activity.id)?.userDuration &&
    Number(activities.find((a) => a.id === activity.id)?.userDuration) >=
      Number(activity.duration)
  ) {
    return "bg-green-300";
  }

  return "bg-red-300";
};

export default function UserDurationForm({
  saveAction,
  activities,
  handleSetDuration,
  unsavedChanges,
}: {
  saveAction: (formData: FormData) => void;
  activities: ExtendedActivity[];
  handleSetDuration: (activity: ExtendedActivity, duration: string) => void;
  unsavedChanges: boolean;
}) {
  return (
    <form action={saveAction}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex flex-col items-center">
            <p className="text-xs">{activity.description}</p>
            <div
              className={`w-2/3 border-none outline-none p-2 rounded-md flex flex-row justify-between items-center gap-2 ${determineColor(
                activities,
                activity
              )}`}
            >
              <div className="flex flex-row gap-1">
                <input
                  type="text"
                  value={
                    activities.find((a) => a.id === activity.id)
                      ?.userDuration || ""
                  }
                  onChange={(e) => {
                    handleSetDuration(
                      activities.find(
                        (a) => a.id === activity.id
                      ) as ExtendedActivity,
                      e.target.value
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
