"use client";

import { checkWordTranslation } from "@/lib/practiceWords/actions";
import { createTask } from "@/lib/practiceWords/createTasks";
import { WordInfo } from "@/lib/practiceWords/types";
import { useActionState, useEffect, useState } from "react";
export default function Practice() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowingAnswer, setIsShowingAnswer] = useState<boolean>(false);
  const [wordsToPractice, setWordsToPractice] = useState<WordInfo[]>([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState<number>(0);
  const currentWord = wordsToPractice[currentPracticeIndex];
  const [
    checkWordTranslationState,
    checkWordTranslationAction,
    checkWordTranslationIsPending,
  ] = useActionState(checkWordTranslation, undefined);

  useEffect(() => {
    async function fetchWords() {
      setIsLoading(true);
      const res = await fetch("/get_words");
      console.log(res);
      const words = await res.json();
      setWordsToPractice(words);
      setIsLoading(false);
    }
    fetchWords();
  }, []);

  useEffect(() => {
    if (checkWordTranslationState) {
      setIsShowingAnswer(true);
    }
  }, [checkWordTranslationState]);

  if (isLoading) {
    return (
      <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4 w-full">
        <h1 className="font-semibold text-3xl">Loading...</h1>
      </div>
    );
  }

  if (wordsToPractice.length === 0) {
    return (
      <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4 w-full">
        <h1 className="font-semibold text-3xl">No words to practice</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4 w-full">
      <h1 className="font-semibold text-3xl">Practice</h1>
      {createTask(currentWord, "EN_RU")}
      {/* <div className="border-2 border-gray-400 rounded-md p-4 flex flex-col items-center bg-blue-200 gap-2">
        <h2 className="font-semibold">
          Word: {currentWord.word}{" "}
          <span className="italic text-sm font-normal">
            ({currentWord.part_of_speech})
          </span>
        </h2>
        {(!checkWordTranslationState || !isShowingAnswer) && (
          <form action={checkWordTranslationAction}>
            <div className="flex flex-col gap-2">
              <label htmlFor="definition_or_translation">
                Write a translation or a definition of the word on any language
              </label>
              <input type="hidden" value={currentWord.word} name="word" />
              <input
                type="hidden"
                value={currentWord.part_of_speech}
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
                  <span className="font-bold">{currentWord.translation}</span>
                </p>
              </div>
            )}
            {currentPracticeIndex + 1 >= wordsToPractice.length ? (
              <button
                type="button"
                className="bg-orange-500 rounded-md p-4 text-white font-semibold text-lg w-full"
                onClick={() => {}}
              >
                Finish practice
              </button>
            ) : (
              <button
                type="button"
                className="bg-yellow-500 rounded-md p-4 text-white font-semibold text-lg disabled:bg-gray-400 disabled:bg-opacity-50 disabled:cursor-not-allowed w-full"
                disabled={checkWordTranslationIsPending}
                onClick={() => {
                  if (currentPracticeIndex + 1 >= wordsToPractice.length) {
                    return;
                  }
                  setIsShowingAnswer(false);
                  setCurrentPracticeIndex((i) => i + 1);
                }}
              >
                Next
              </button>
            )}
          </>
        )}
      </div> */}
    </div>
  );
}
