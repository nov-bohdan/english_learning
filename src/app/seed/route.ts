import { dbClient } from "@/lib/db/dbClient";

export async function GET(request: Request) {
  await dbClient.seed();
  return Response.json({ message: "Seed successful" });
}
