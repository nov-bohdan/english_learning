import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";

export function getClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_KEY || ""
  );
}

export const dbClient = {
  client: getClient(),
};
