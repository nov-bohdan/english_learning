import { Activity } from "@/lib/types";

export type ExtendedActivity = Activity & {
  defaultUserDuration: string;
  isDraft: boolean;
};

const determineColor = (activity: ExtendedActivity) => {
  if (activity.isDraft) {
    return "bg-yellow-300";
  }

  if (
    activity.userDuration &&
    Number(activity.userDuration) >= Number(activity.duration)
  ) {
    return "bg-[#77DD77]";
  }

  return "bg-[#FFB6C1]";
};

export default function UserDurationForm({
  saveAction,
  activities,
  handleSetDuration,
  unsavedChanges,
  isPending,
}: {
  saveAction: (formData: FormData) => void;
  activities: ExtendedActivity[];
  handleSetDuration: (activity: ExtendedActivity, duration: string) => void;
  unsavedChanges: boolean;
  isPending: boolean;
}) {
  return (
    <form action={saveAction}>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex flex-col items-center">
            <p className="text-xs">{activity.description}</p>
            <div
              className={`w-2/3 border-none outline-none p-2 rounded-md flex flex-row justify-between items-center gap-2 ${determineColor(
                activity
              )}`}
            >
              <div className="flex flex-row gap-1">
                <input
                  type="text"
                  value={activity.userDuration}
                  onChange={(e) => {
                    handleSetDuration(activity, e.target.value);
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
        <button
          className="bg-blue-500 text-white p-2 rounded-md mt-2 disabled:opacity-50 disabled:bg-gray-400"
          disabled={isPending}
        >
          Save
        </button>
      )}
      {isPending && <p>Saving...</p>}
    </form>
  );
}
