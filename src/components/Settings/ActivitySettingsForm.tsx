"use client";

import { ActivityType, UserSettings } from "../../lib/types";

export default function ActivitySettingsForm({
  activitySettings,
  activityTypes,
  handleSaveActivitySettings,
}: {
  activitySettings: UserSettings["settings"]["activities"];
  activityTypes: ActivityType[];
  handleSaveActivitySettings: (
    settings: UserSettings["settings"]["activities"]
  ) => void;
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
            value={activitySettings.activityPriorities[type.id]}
            onChange={(e) => {
              handleSaveActivitySettings({
                ...activitySettings,
                activityPriorities: {
                  ...activitySettings.activityPriorities,
                  [type.id]: Number(e.target.value),
                },
              });
            }}
            className="bg-gray-400 rounded-md p-2 w-20"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
      ))}
    </div>
  );
}
