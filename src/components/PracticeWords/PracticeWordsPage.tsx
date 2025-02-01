"use client";

import { useEffect, useState } from "react";
import { WordInfo } from "@/lib/practiceWords/types";
import WordListItem from "./WordListItem";
import Practice from "./Practice";
import GetWordInfoPanel from "./GetWordInfoPanel";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import WordInfoUI from "./WordInfoUI";
import { generateAudio } from "@/lib/elevenlabs/audio";

const getWordsToPracticeNowCount = (words: WordInfo[]) => {
  let count = 0;
  for (const word of words) {
    const wordNextReviewDateMilis = DateTime.fromISO(
      word.next_review_date
    ).toMillis();
    const timeNowMillis = DateTime.now().toMillis();
    console.log(
      `nextReviewDate: ${wordNextReviewDateMilis}\ntimeNowMillis: ${timeNowMillis}`
    );
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

  useEffect(() => {
    setWordsToPracticeNowCount(getWordsToPracticeNowCount(wordsState));
  }, [wordsState, words]);

  return (
    <div className="flex flex-row gap-4 w-full">
      {!isPracticeMode && (
        <>
          {/* LEFT PANEL */}
          <div className="bg-gray-200 rounded-md p-4 w-1/4 max-h-screen overflow-y-scroll">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-bold text-3xl">Saved words</h2>
              <button
                type="button"
                onClick={() => generateAudio("Test audio file")}
              >
                Get audio
              </button>
              {/* <audio controls>
                <source
                  src={"audio/tts-5e87b667-f657-44c4-a6ef-49bbdbf1354d.mp3"}
                  type="audio/mpeg"
                />
              </audio> */}

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
              .sort((a, b) => b.progress - a.progress)
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
  );
}
