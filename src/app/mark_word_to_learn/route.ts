import { getUser } from "@/lib/auth/auth";
import dbWords from "@/lib/db/words";
import { processGetWordInfoAndSave } from "@/lib/practiceWords/actions";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const body = await request.json();
  const word = body.word;
  const wordId = body.wordId;
  console.log(`markWordAsToLearn. word: ${word}`);
  let user;
  try {
    user = await getUser();
  } catch {
    return Response.json({
      success: false,
      error: "User is not authorized",
    });
  }

  dbWords.markWordsAsWantToLearn(user.user.id, wordId);
  const linkedWords = await processGetWordInfoAndSave(word, user);
  linkedWords.data.forEach((word) => {
    dbWords.addNewWordToReview(user.user.id, word.id);
  });
  revalidatePath("/words");
  return Response.json({ success: true });
}
