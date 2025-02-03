import PracticeWordsPage from "@/components/PracticeWords/PracticeWordsPage";
import dbWords from "@/lib/db/words";
import { mapRawRowToWords } from "@/lib/helpers/words";

export default async function Page() {
  const words = await dbWords.getWords(1);
  const mappedWords = mapRawRowToWords(words);
  const wordsNumberPracticedToday = await dbWords.getWordsNumberPracticedToday(
    1
  );
  const savedWordsNumberByDate = await dbWords.getSavedWordsNumberByDate(1);
  return (
    <PracticeWordsPage
      words={mappedWords}
      wordsNumberPracticedToday={wordsNumberPracticedToday}
      savedWordsNumberByDate={savedWordsNumberByDate}
    />
  );
}
