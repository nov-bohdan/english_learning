"use client";

import { ActivityType, UserSettings } from "../../lib/helpers/types";

export default function ActivitySettingsForm({
  activitySettings,
  activityTypes,
  handleSaveActivitySettings,
  handleDeleteActivity,
  isDeleting,
}: {
  activitySettings: UserSettings["settings"]["activities"]["activityPriorities"];
  activityTypes: ActivityType[];
  handleSaveActivitySettings: (
    settings: UserSettings["settings"]["activities"]["activityPriorities"]
  ) => void;
  handleDeleteActivity: (id: number) => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">Priority of activities</h2>
      <h3 className="text-sm text-gray-500">
        The priority of activities is used to determine how much time you should
        spend on each activity.
      </h3>
      {activityTypes.map((type) => (
        <div key={type.id} className="flex flex-row gap-2 items-center">
          <p>{type.name}</p>
          <select
            value={activitySettings[type.id]}
            onChange={(e) => {
              handleSaveActivitySettings({
                ...activitySettings,
                [type.id]: Number(e.target.value),
              });
            }}
            className="bg-gray-400 rounded-md p-2 w-26"
          >
            <option value={1}>Low</option>
            <option value={2}>Medium</option>
            <option value={3}>High</option>
          </select>
          <button
            type="button"
            onClick={() => {
              handleDeleteActivity(type.id);
            }}
            className="bg-red-500 text-white p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={isDeleting}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
