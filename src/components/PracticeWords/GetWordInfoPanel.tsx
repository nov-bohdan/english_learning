import { mapRawRowToWords } from "@/lib/helpers/words";
import { getWordInfo } from "@/lib/practiceWords/actions";
import { RawWordInfoRow, WordInfo } from "@/lib/practiceWords/types";
import { Dispatch, SetStateAction, useActionState, useCallback } from "react";
import NewWordForm from "./NewWordForm";
import NewWordInfo from "./NewWordInfo";
import Error from "../Errors/Error";

export default function GetWordInfoPanel({
  setWordsListState,
}: {
  setWordsListState: Dispatch<SetStateAction<WordInfo[]>>;
}) {
  const [getWordInfoState, getWordInfoAction, getWordInfoPending] =
    useActionState(getWordInfo, undefined);

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
    <div className="flex flex-col gap-6">
      {/* Adding New Word */}
      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300">
        {getWordInfoState?.error && (
          <div className="mb-4">
            <Error message={getWordInfoState.error} />
          </div>
        )}
        <NewWordForm
          getWordInfoAction={getWordInfoAction}
          getWordInfoPending={getWordInfoPending}
        />
      </div>

      {/* New Word Info List */}
      <div className="flex flex-col gap-4">
        {getWordInfoState?.data?.map((wordInfo) => (
          <div
            key={`${wordInfo.word}-${wordInfo.part_of_speech}-${wordInfo.translation}`}
            className="bg-white rounded-xl shadow-md p-4 transition-transform duration-300"
          >
            <NewWordInfo
              wordInfo={wordInfo}
              onAddNewWord={addNewWordsToList}
              isAlreadySaved={wordInfo.isAlreadySaved || false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
