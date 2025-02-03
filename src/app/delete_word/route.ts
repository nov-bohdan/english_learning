import { getUser } from "@/lib/auth/auth";
import dbWords from "@/lib/db/words";
import { revalidatePath } from "next/cache";

export async function DELETE(request: Request) {
  let user;
  try {
    user = await getUser();
  } catch {
    return Response.json({
      success: false,
      error: "User is not authorized",
    });
  }
  const res = await request.json();
  const wordId = res["wordId"];
  await dbWords.unassignWordToUser(wordId, user.user.id);
  revalidatePath("/words");
}
