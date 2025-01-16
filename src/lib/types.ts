export type ActivityType = {
  id: number;
  name: string;
  color: string;
};

export type Activity = {
  id: number;
  date: Date;
  description: string;
  duration: number;
  type: ActivityType;
  userDuration: string;
};
