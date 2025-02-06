import { RawWordInfoRow, WordInfo } from "@/lib/practiceWords/types";
import { useActionState, useEffect, useState } from "react";
import WordInfoUI from "../WordInfoUI";
import {
  assignWordToUser,
  deleteWordToReview,
} from "@/lib/practiceWords/actions";

export default function WordToReview({
  word,
  onAddNewWord,
  isAlreadySaved,
}: {
  word: WordInfo;
  onAddNewWord: (newWords: RawWordInfoRow[]) => void;
  isAlreadySaved: boolean;
}) {
  const [isShowingDetails, setIsShowingDetails] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(isAlreadySaved);
  const [saveWordState, saveWordAction, saveWordIsPending] = useActionState(
    assignWordToUser.bind(null, word.id),
    undefined
  );

  useEffect(() => {
    const deleteFromWordsToReviewAndSaveToList = async () => {
      if (!saveWordState?.data) return;
      await deleteWordToReview(word.id);

      //   setIsSaved(true);
      onAddNewWord(saveWordState.data);
    };

    deleteFromWordsToReviewAndSaveToList();
  }, [saveWordState, onAddNewWord, word.id]);

  useEffect(() => {
    setIsSaved(isAlreadySaved);
  }, [isAlreadySaved]);

  return (
    <>
      <div
        key={word.id}
        className="bg-white rounded-lg shadow-lg p-4 w-full flex flex-row justify-between items-center border-gray-100 border-2"
      >
        <p>
          {word.word} ({word.part_of_speech})
        </p>
        <button
          type="button"
          className="bg-blue-500 py-2 px-4 font-semibold text-white rounded-lg hover:bg-blue-600"
          onClick={() => setIsShowingDetails(!isShowingDetails)}
        >
          Details
        </button>
      </div>
      {isShowingDetails && (
        <WordInfoUI wordInfo={word}>
          <form action={saveWordAction}>
            <button
              type="submit"
              disabled={saveWordIsPending || isSaved}
              className="bg-blue-500 p-2 rounded-md text-lg text-white font-semibold transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSaved ? "Already saved" : "Save word"}
            </button>
          </form>
        </WordInfoUI>
      )}
    </>
  );
}
