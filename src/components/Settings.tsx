"use client";

import { UserSettings } from "@/lib/types";
import ActivitySettingsForm from "./ActivitySettingsForm";
import { useActionState, useEffect, useState } from "react";
import { saveUserSettings } from "@/lib/actions";

export default function Settings({
  userSettings,
}: {
  userSettings: UserSettings;
}) {
  const [settings, setSettings] = useState<UserSettings>(userSettings);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveState, saveAction] = useActionState(
    saveUserSettings.bind(null, 1, settings),
    null
  );

  useEffect(() => {
    if (saveState) {
      setSettings(saveState);
    }
  }, [saveState]);

  const handleSaveActivitySettings = (
    settings: UserSettings["settings"]["activities"]
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      settings: {
        ...prevSettings.settings,
        activities: settings,
      },
    }));
    setUnsavedChanges(true);
  };

  return (
    <div className="bg-gray-200 rounded-md p-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form action={saveAction}>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">Priority of activities</h2>
          <h3 className="text-sm text-gray-500">
            The priority of activities is used to determine how much time you
            should spend on each activity.
          </h3>
          <div className="flex flex-row gap-2">
            <ActivitySettingsForm
              activitySettings={settings.settings.activities}
              activityTypes={settings.settings.activities.activityTypes}
              handleSaveActivitySettings={handleSaveActivitySettings}
            />
          </div>
        </div>
        {unsavedChanges && (
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            Save
          </button>
        )}
      </form>
    </div>
  );
}
