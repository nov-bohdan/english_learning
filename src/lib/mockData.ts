import { Activity, ActivityType, UserSettings } from "./types";

export const activityTypes: ActivityType[] = [
  {
    id: 1,
    name: "Book A1 (1)",
    color: "#AEC6CF",
  },
  {
    id: 2,
    name: "Book A1 (2)",
    color: "#FFB6C1",
  },
  {
    id: 3,
    name: "Daily phrases book (1)",
    color: "#77DD77",
  },
  {
    id: 4,
    name: "Promova",
    color: "#FF6961",
  },
  {
    id: 5,
    name: "ChatGPT",
    color: "#FDFD96",
  },
];

export const userSettings: UserSettings = {
  userId: 1,
  userName: "Test User",
  activities: {
    activityPriorities: {
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 1,
    },
    activityTypes: activityTypes,
  },
};

export const activities: Activity[] = [
  {
    id: 1,
    date: new Date(2025, 0, 16),
    description: "Book A1 (1)",
    duration: 30,
    type: activityTypes[0],
    userDuration: "0",
  },
  {
    id: 2,
    date: new Date(2025, 0, 16),
    description: "Book A1 (2)",
    duration: 15,
    type: activityTypes[1],
    userDuration: "0",
  },
  {
    id: 3,
    date: new Date(2025, 0, 16),
    description: "Daily phrases book (1)",
    duration: 15,
    type: activityTypes[2],
    userDuration: "0",
  },
  {
    id: 4,
    date: new Date(2025, 0, 16),
    description: "Promova",
    duration: 15,
    type: activityTypes[3],
    userDuration: "0",
  },
  {
    id: 5,
    date: new Date(2025, 0, 16),
    description: "ChatGPT",
    duration: 15,
    type: activityTypes[4],
    userDuration: "0",
  },
];
