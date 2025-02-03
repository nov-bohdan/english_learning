export const dynamic = "force-dynamic";

import PracticeWordsPage from "@/components/PracticeWords/PracticeWordsPage";
import { getUser } from "@/lib/auth/auth";
import dbWords from "@/lib/db/words";
import { mapRawRowToWords } from "@/lib/helpers/words";

export default async function Page() {
  const user = await getUser();
  console.log(user);
  const words = await dbWords.getWords(user.user.id);
  const mappedWords = mapRawRowToWords(words);
  const wordsNumberPracticedToday = await dbWords.getWordsNumberPracticedToday(
    user.user.id
  );
  const savedWordsNumberByDate = await dbWords.getSavedWordsNumberByDate(
    user.user.id
  );
  return (
    <PracticeWordsPage
      words={mappedWords}
      wordsNumberPracticedToday={wordsNumberPracticedToday}
      savedWordsNumberByDate={savedWordsNumberByDate}
    />
  );
}
