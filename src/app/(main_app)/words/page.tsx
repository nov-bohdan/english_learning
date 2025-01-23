import PracticeWordsPage from "@/components/PracticeWords/PracticeWordsPage";
import dbWords from "@/lib/db/words";
import { mapRawRowToWords } from "@/lib/helpers/words";

export default async function Page() {
  const words = await dbWords.getWords();
  const mappedWords = mapRawRowToWords(words);
  return <PracticeWordsPage words={mappedWords} />;
}
