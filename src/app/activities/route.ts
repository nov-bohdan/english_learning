import dbActivities from "@/lib/db/activities";
import dbUserSettings from "@/lib/db/userSettings";
import { revalidatePath } from "next/cache";

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await dbActivities.deleteActivityType(id);
  await dbUserSettings.deleteActivityFromSettings(1, id);
  revalidatePath("/settings");
  return Response.json({ message: "Activity deleted" });
}
