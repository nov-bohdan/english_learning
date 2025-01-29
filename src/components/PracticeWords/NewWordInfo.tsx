import { saveWords } from "@/lib/practiceWords/actions";
import { RawWordInfoInsert, RawWordInfoRow } from "@/lib/practiceWords/types";
import { useActionState, useEffect, useState } from "react";
import WordInfoUI from "./WordInfoUI";

export default function NewWordInfo({
  wordInfo,
  onAddNewWord,
  isAlreadySaved,
}: {
  wordInfo: RawWordInfoInsert;
  onAddNewWord: (newWords: RawWordInfoRow[]) => void;
  isAlreadySaved: boolean;
}) {
  const [isSaved, setIsSaved] = useState<boolean>(isAlreadySaved);
  const [saveWordState, saveWordAction, saveWordIsPending] = useActionState(
    saveWords.bind(null, [wordInfo]),
    undefined
  );

  useEffect(() => {
    if (!saveWordState) return;

    setIsSaved(true);
    onAddNewWord(saveWordState);
  }, [saveWordState, onAddNewWord]);

  useEffect(() => {
    setIsSaved(isAlreadySaved);
  }, [isAlreadySaved]);

  return (
    <WordInfoUI wordInfo={wordInfo}>
      <form action={saveWordAction}>
        <button
          type="submit"
          disabled={saveWordIsPending || isSaved}
          className="bg-blue-500 p-2 rounded-md text-lg text-white disabled:bg-gray-400 disabled:bg-opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {isSaved ? "Already saved" : "Save word"}
        </button>
      </form>
    </WordInfoUI>
  );
}
