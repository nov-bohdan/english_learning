import PracticeWordsPage from "@/components/PracticeWords/PracticeWordsPage";
import dbWords from "@/lib/db/words";
import { mapRawToWords } from "@/lib/helpers/words";

export default async function Page() {
  const words = await dbWords.getWords();
  const mappedWords = mapRawToWords(words);
  return <PracticeWordsPage words={mappedWords} />;
}
