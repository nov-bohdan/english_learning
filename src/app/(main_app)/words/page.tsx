export const dynamic = "force-dynamic";

import PracticeWordsPage from "@/components/PracticeWords/PracticeWordsPage";
import { getUser } from "@/lib/auth/auth";
import dbWords from "@/lib/db/words";
import { mapRawRowToWords } from "@/lib/helpers/words";
import { RawWordInfoRow } from "@/lib/practiceWords/types";

export default async function Page() {
  const user = await getUser();
  const userId = user.user.id;
  const words = await dbWords.getWords(userId);
  const mappedWords = mapRawRowToWords(words);
  const wordsNumberPracticedToday = await dbWords.getWordsNumberPracticedToday(
    userId
  );
  const savedWordsNumberByDate = await dbWords.getSavedWordsNumberByDate(
    userId
  );
  const wordsToReview = await dbWords.getWordsToReview(userId);
  const rawWordsToReview: RawWordInfoRow[] = wordsToReview.map(
    (word) => word.word
  );
  const wordsToReviewMapped = mapRawRowToWords(rawWordsToReview);
  return (
    <PracticeWordsPage
      words={mappedWords}
      wordsNumberPracticedToday={wordsNumberPracticedToday}
      savedWordsNumberByDate={savedWordsNumberByDate}
      wordsToReview={wordsToReviewMapped}
    />
  );
}
