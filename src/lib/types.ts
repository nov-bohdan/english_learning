export type Activity = {
  id: number;
  name: string;
  description: string;
  duration: number;
  type: string;
};

export type ActivityList = {
  id: number;
  date: Date;
  activities: Activity[];
};
