import { createClient } from "@supabase/supabase-js";
import { activities } from "../mockData";

export function getClient() {
  return createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_KEY || ""
  );
}

export const dbClient = {
  client: getClient(),

  seed: async function () {
    const { data, error } = await this.client.from("activities").insert(
      activities.map((activity) => ({
        date: activity.date,
        description: activity.description,
        duration: activity.duration,
        type_id: activity.type.id,
        user_duration: activity.userDuration,
      }))
    );
    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
  },
};
