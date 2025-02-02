"use client";

import { useEffect, useState } from "react";
import { WordInfo } from "@/lib/practiceWords/types";
import WordListItem from "./WordListItem";
import Practice from "./Practice";
import GetWordInfoPanel from "./GetWordInfoPanel";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import WordInfoUI from "./WordInfoUI";

const getWordsToPracticeNowCount = (words: WordInfo[]) => {
  let count = 0;
  for (const word of words) {
    const wordNextReviewDateMilis = DateTime.fromISO(
      word.next_review_date
    ).toMillis();
    const timeNowMillis = DateTime.now().toMillis();
    if (!wordNextReviewDateMilis || wordNextReviewDateMilis <= timeNowMillis)
      count++;
  }

  return count;
};

export default function PracticeWordsPage({ words }: { words: WordInfo[] }) {
  const [wordsState, setWordsState] = useState<WordInfo[]>(words);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [wordsToPracticeNowCount, setWordsToPracticeNowCount] =
    useState<number>(getWordsToPracticeNowCount(words));
  const [showWordDetails, setShowWordDetails] = useState<WordInfo | null>(null);

  const wordsWithLowProgress = wordsState.filter(
    (word) => word.avgProgress < 33
  ).length;
  const wordsWithMediumProgress = wordsState.filter(
    (word) => word.avgProgress >= 33 && word.avgProgress < 66
  ).length;
  const wordsWithHighProgress = wordsState.filter(
    (word) => word.avgProgress > 66
  ).length;

  useEffect(() => {
    setWordsToPracticeNowCount(getWordsToPracticeNowCount(wordsState));
  }, [wordsState, words]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* TOP PANEL */}
      <div className="p-6 w-full bg-gray-200 rounded-md">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-row justify-center items-center w-full text-xl font-semibold gap-6">
            <p className="flex flex-row gap-2 items-center">
              <span className="rounded-full w-4 h-4 bg-red-500 block"></span>
              <span> Words: {wordsWithLowProgress}</span>
            </p>
            <p className="flex flex-row gap-2 items-center">
              <span className="rounded-full w-4 h-4 bg-yellow-500 block"></span>
              <span> Words: {wordsWithMediumProgress}</span>
            </p>
            <p className="flex flex-row gap-2 items-center">
              <span className="rounded-full w-4 h-4 bg-green-500 block"></span>
              <span> Words: {wordsWithHighProgress}</span>
            </p>
          </div>
          <p className="text-2xl font-semibold">Total: {wordsState.length}</p>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        {!isPracticeMode && (
          <>
            {/* LEFT PANEL */}
            <div className="bg-gray-200 rounded-md p-4 w-1/4 max-h-screen overflow-y-scroll">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-bold text-3xl">Saved words</h2>
                <button
                  type="button"
                  className="bg-blue-500 p-2 text-white rounded-xl font-semibold cursor-pointer disabled:bg-gray-400 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:text-xs disabled:p-1"
                  onClick={() => setIsPracticeMode(true)}
                  disabled={wordsToPracticeNowCount < 5}
                >
                  {wordsToPracticeNowCount < 5
                    ? "You need 5 words to start practice"
                    : "Start practice"}
                </button>
              </div>
              {wordsState
                .sort((a, b) => b.avgProgress - a.avgProgress)
                .map((word) => (
                  <WordListItem
                    key={`${word.word}-${word.part_of_speech}`}
                    word={word}
                    onShowDetails={() => setShowWordDetails(word)}
                  />
                ))}
            </div>
            {/* RIGHT PANEL */}
            {showWordDetails ? (
              <WordInfoUI wordInfo={showWordDetails}>
                <button
                  type="button"
                  className="bg-blue-500 rounded-md py-4 px-8 font-semibold text-white"
                  onClick={() => setShowWordDetails(null)}
                >
                  Close
                </button>
              </WordInfoUI>
            ) : (
              <GetWordInfoPanel setWordsListState={setWordsState} />
            )}
          </>
        )}
        {isPracticeMode && (
          <Practice onFinishPractice={() => redirect("/words")} />
        )}
      </div>
    </div>
  );
}
