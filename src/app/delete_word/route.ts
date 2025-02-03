import dbWords from "@/lib/db/words";
import { revalidatePath } from "next/cache";

export async function DELETE(request: Request) {
  const res = await request.json();
  console.log(res);
  const wordId = res["wordId"];
  await dbWords.unassignWordToUser(wordId, 1);
  revalidatePath("/words");
}
