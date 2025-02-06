import { RawWordInfoRow, WordInfo } from "@/lib/practiceWords/types";
import WordToReview from "./WordToReview";
import { Dispatch, SetStateAction, useCallback } from "react";
import { mapRawRowToWords } from "@/lib/helpers/words";

export default function ReviewNewWords({
  wordsToReview,
  setWordsListState,
}: {
  wordsToReview: WordInfo[];
  setWordsListState: Dispatch<SetStateAction<WordInfo[]>>;
}) {
  const addNewWordsToList = useCallback(
    (newWords: RawWordInfoRow[]) => {
      const mappedWords = mapRawRowToWords(newWords);
      setWordsListState((prevWordsState) => [
        ...prevWordsState,
        ...mappedWords,
      ]);
    },
    [setWordsListState]
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 flex flex-col items-center gap-2">
      {wordsToReview.map((word) => (
        <WordToReview
          key={word.id}
          word={word}
          isAlreadySaved={false}
          onAddNewWord={addNewWordsToList}
        />
      ))}
    </div>
  );
}
