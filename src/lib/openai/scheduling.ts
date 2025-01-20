import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { Activity, ActivityType } from "../helpers/types";
import { openai } from "./openaiClient";
import { z } from "zod";

const ActivitySchedule = z.object({
  response: z.array(
    z.object({
      date: z.string(),
      duration: z.number(),
      typeId: z.number(),
      reasonToChoose: z.string(),
    })
  ),
});

export const scheduleActivities = async (
  previousActivities: Activity[],
  activityTypes: ActivityType[],
  activityPriorities: { [activityId: number]: number },
  daysToSchedule: {
    date: string;
    dayOfWeek: string;
    availableTimeInMinutes: number;
  }[]
) => {
  const prompt = `
    You are a helpful assistant that schedules activities for a user.
    You are given a list of previous activities, a list of available activity types, a list of activity priorities, and a list of days to schedule.
    You need to schedule the activities for the days to schedule. Here is the information you have:
    - Previous activities: ${JSON.stringify(previousActivities)}
    - Available activity types: ${JSON.stringify(activityTypes)}
    - Activity priorities: ${JSON.stringify(
      activityPriorities
    )} [The number is the priority of the activity, the higher the number, the more important the activity is]
    - Days to schedule: ${JSON.stringify(daysToSchedule)}
    Never add activities that are not in the list of available activity types.
    Always use available time in full. Never exceed the available time.
  `;

  //   console.log(prompt);

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(ActivitySchedule, "activitySchedule"),
  });

  if (!response.choices[0].message.parsed) {
    throw new Error("No activities scheduled");
  }

  console.log(JSON.stringify(response.choices[0].message.parsed));

  return response.choices[0].message.parsed.response;
};
