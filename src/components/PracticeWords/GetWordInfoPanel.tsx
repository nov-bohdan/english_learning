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

  const addNewWordsToList = useCallback((newWords: RawWordInfoRow[]) => {
    const mappedWords = mapRawRowToWords(newWords);
    setWordsListState((prevWordsState) => [...prevWordsState, ...mappedWords]);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-3/4">
      {/* ADDING NEW WORD */}
      <div className="bg-gray-200 rounded-md p-4">
        {getWordInfoState?.error && <Error message={getWordInfoState.error} />}
        <NewWordForm
          getWordInfoAction={getWordInfoAction}
          getWordInfoPending={getWordInfoPending}
        />
      </div>
      {/* NEW WORD INFO */}
      {getWordInfoState?.data?.map((wordInfo) => {
        return (
          <NewWordInfo
            key={`${wordInfo.word}-${wordInfo.part_of_speech}-${wordInfo.translation}`}
            wordInfo={wordInfo}
            onAddNewWord={addNewWordsToList}
            isAlreadySaved={wordInfo.isAlreadySaved || false}
          />
        );
      })}
    </div>
  );
}
