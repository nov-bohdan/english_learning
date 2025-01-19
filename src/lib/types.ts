export type ActivityType = {
  id: number;
  name: string;
};

export type RawActivity = {
  id: number;
  date: string;
  description: string;
  duration: number;
  type_id: number;
  user_duration: string;
};

export type Activity = {
  id: number;
  date: Date;
  description: string;
  duration: number;
  type: ActivityType;
  userDuration: string;
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
  };
};

export type Calendar = {
  [key: string]: {
    [key: string]: Date[];
  };
};
