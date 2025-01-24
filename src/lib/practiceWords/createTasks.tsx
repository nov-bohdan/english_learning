import { useActionState, useEffect, useState } from "react";
import { WordInfo } from "./types";
import { checkWordTranslation } from "./actions";

function EnRuTask({ word }: { word: WordInfo }) {
  const [isShowingAnswer, setIsShowingAnswer] = useState<boolean>(false);
  const [
    checkWordTranslationState,
    checkWordTranslationAction,
    checkWordTranslationIsPending,
  ] = useActionState(checkWordTranslation, undefined);

  useEffect(() => {
    if (checkWordTranslationState) {
      setIsShowingAnswer(true);
    }
  }, [checkWordTranslationState]);

  return (
    <>
      <div className="border-2 border-gray-400 rounded-md p-4 flex flex-col items-center bg-blue-200 gap-2">
        <h2 className="font-semibold">
          Word: {word.word}{" "}
          <span className="italic text-sm font-normal">
            ({word.part_of_speech})
          </span>
        </h2>
        {(!checkWordTranslationState || !isShowingAnswer) && (
          <form action={checkWordTranslationAction}>
            <div className="flex flex-col gap-2">
              <label htmlFor="definition_or_translation">
                Write a translation or a definition of the word on any language
              </label>
              <input type="hidden" value={word.word} name="word" />
              <input
                type="hidden"
                value={word.part_of_speech}
                name="part_of_speech"
              />
              <input
                type="text"
                name="definition_or_translation"
                className="p-4 border-2 border-gray-200 rounded-md"
              />
              <button
                type="submit"
                className="bg-blue-500 rounded-md p-4 text-white font-semibold text-lg disabled:bg-gray-400 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                disabled={checkWordTranslationIsPending}
              >
                Check
              </button>
            </div>
          </form>
        )}
        {checkWordTranslationState && isShowingAnswer && (
          <>
            {checkWordTranslationState.grade >= 80 && (
              <div className="bg-green-400 rounded-md p-4 w-full">
                <p>
                  Your answer is correct! Your grade for this answer is{" "}
                  {checkWordTranslationState.grade}%
                </p>
              </div>
            )}
            {checkWordTranslationState.grade < 80 && (
              <div className="bg-red-400 rounded-md p-4 w-full">
                <p>
                  Your answer is incorrect! Your grade for this answer is{" "}
                  {checkWordTranslationState.grade}%. Correct answer is:{" "}
                  <span className="font-bold">{word.translation}</span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export function createTask(word: WordInfo, taskType: "EN_RU") {
  switch (taskType) {
    case "EN_RU":
      return <EnRuTask word={word} />;
  }
}
