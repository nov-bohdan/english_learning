"use client";

import { ActivityType, UserSettings } from "@/lib/helpers/types";
import ActivitySettingsForm from "./ActivitySettingsForm";
import { useActionState, useEffect, useState } from "react";
import { saveNewActivity, saveUserSettings } from "@/lib/actions";
import AvailableTimeForm from "./AvailableTimeForm";
import NewActivityForm from "./NewActivityForm";

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

  const [saveNewActivityState, saveNewActivityAction] = useActionState(
    saveNewActivity.bind(null, 1),
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (saveNewActivityState) {
      handleSaveNewActivity(saveNewActivityState);
    }
  }, [saveNewActivityState]);

  useEffect(() => {
    if (saveState) {
      setSettings(saveState);
      setUnsavedChanges(false);
    }
  }, [saveState]);

  const handleSaveNewActivity = (activity: ActivityType) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      settings: {
        ...prevSettings.settings,
        activities: {
          ...prevSettings.settings.activities,
          activityTypes: [
            ...prevSettings.settings.activities.activityTypes,
            activity,
          ],
        },
      },
    }));
  };

  const handleSaveActivitySettings = (
    settings: UserSettings["settings"]["activities"]["activityPriorities"]
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      settings: {
        ...prevSettings.settings,
        activities: {
          ...prevSettings.settings.activities,
          activityPriorities: settings,
        },
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

  const handleDeleteActivity = async (id: number) => {
    setIsDeleting(true);
    const response = await fetch("/activities", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        settings: {
          ...prevSettings.settings,
          activities: {
            ...prevSettings.settings.activities,
            activityTypes:
              prevSettings.settings.activities.activityTypes.filter(
                (type) => type.id !== id
              ),
          },
        },
      }));
    }
    setIsDeleting(false);
  };
  return (
    <div className="bg-gray-200 rounded-md p-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <NewActivityForm saveNewActivityAction={saveNewActivityAction} />
      <form action={saveAction}>
        <ActivitySettingsForm
          activitySettings={settings.settings.activities.activityPriorities}
          activityTypes={settings.settings.activities.activityTypes}
          handleSaveActivitySettings={handleSaveActivitySettings}
          handleDeleteActivity={handleDeleteActivity}
          isDeleting={isDeleting}
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
