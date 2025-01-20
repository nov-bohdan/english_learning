import { createClient } from "@supabase/supabase-js";
import { activities } from "../mockData";
import { Database } from "./supabase";

export function getClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_KEY || ""
  );
}

export const dbClient = {
  client: getClient(),

  seed: async function () {
    const { data, error } = await this.client.from("activities").insert(
      activities.map((activity) => ({
        date: activity.date.toISOString(),
        description: activity.description,
        duration: activity.duration,
        type_id: activity.type.id,
        user_duration: Number(activity.userDuration),
      }))
    );
    if (error) {
      throw new Error(error.message);
    }
    console.log(data);
  },
};
