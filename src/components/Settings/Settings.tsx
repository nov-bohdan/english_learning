"use client";

import { UserSettings } from "@/lib/types";
import ActivitySettingsForm from "./ActivitySettingsForm";
import { useActionState, useEffect, useState } from "react";
import { saveUserSettings } from "@/lib/actions";
import AvailableTimeForm from "./AvailableTimeForm";

export default function Settings({
  userSettings,
}: {
  userSettings: UserSettings;
}) {
  const [settings, setSettings] = useState<UserSettings>(userSettings);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [saveState, saveAction, isPending] = useActionState(
    saveUserSettings.bind(null, 1, settings),
    null
  );

  useEffect(() => {
    if (saveState) {
      setSettings(saveState);
      setUnsavedChanges(false);
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

  const handleSaveAvailableTime = (availableTime: {
    [key: number]: number;
  }) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      settings: {
        ...prevSettings.settings,
        availableTime: availableTime,
      },
    }));
    setUnsavedChanges(true);
  };

  return (
    <div className="bg-gray-200 rounded-md p-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form action={saveAction}>
        <ActivitySettingsForm
          activitySettings={settings.settings.activities}
          activityTypes={settings.settings.activities.activityTypes}
          handleSaveActivitySettings={handleSaveActivitySettings}
        />
        <AvailableTimeForm
          availableTime={settings.settings.availableTime}
          handleSaveAvailableTime={handleSaveAvailableTime}
        />
        {unsavedChanges && (
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 text-white p-2 rounded-md disabled:opacity-50 disabled:bg-gray-400"
          >
            Save
          </button>
        )}
        {isPending && <p>Saving...</p>}
      </form>
    </div>
  );
}
