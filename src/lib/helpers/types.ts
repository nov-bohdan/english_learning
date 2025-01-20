import { DateTime } from "luxon";

export type ActivityType = {
  id: number;
  name: string;
};

export type RawActivity = {
  id: number;
  date: string;
  duration: number;
  type_id: number;
  user_duration: number;
};

export type Activity = {
  id: number;
  date: DateTime;
  duration: number;
  type: ActivityType;
  userDuration: number;
};

export type RawUserSettings = {
  user_id: number;
  settings: {
    userName: string;
    activities: {
      activityPriorities: {
        [id: string]: number;
      };
      activityTypeIds: number[];
    };
    availableTime: {
      [day: number]: number;
    };
  };
};

export type UserSettings = {
  userId: number;
  settings: {
    userName: string;
    activities: {
      activityPriorities: {
        [id: number]: number;
      };
      activityTypes: ActivityType[];
    };
    availableTime: {
      [dayOfWeek: number]: number;
    };
  };
};

export type Calendar = {
  [key: string]: {
    [key: string]: DateTime[];
  };
};
