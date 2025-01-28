"use client";

import { useState } from "react";
import { WordInfo } from "@/lib/practiceWords/types";
import WordListItem from "./WordListItem";
import Practice from "./Practice";
import GetWordInfoPanel from "./GetWordInfoPanel";
import { redirect } from "next/navigation";

export default function PracticeWordsPage({ words }: { words: WordInfo[] }) {
  const [wordsState, setWordsState] = useState<WordInfo[]>(words);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);

  return (
    <div className="flex flex-row gap-4 w-full">
      {!isPracticeMode && (
        <>
          {/* LEFT PANEL */}
          <div className="bg-gray-200 rounded-md p-4 w-1/4 max-h-[500px]">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-bold text-3xl">Saved words</h2>
              <button
                type="button"
                className="bg-blue-500 p-2 text-white rounded-xl font-semibold"
                onClick={() => setIsPracticeMode(true)}
              >
                Start practice
              </button>
            </div>
            {wordsState
              .sort((a, b) => b.progress - a.progress)
              .map((word) => (
                <WordListItem
                  key={`${word.word}-${word.part_of_speech}`}
                  word={word}
                />
              ))}
          </div>
          {/* RIGHT PANEL */}
          <GetWordInfoPanel setWordsListState={setWordsState} />
        </>
      )}
      {isPracticeMode && (
        <Practice onFinishPractice={() => redirect("/words")} />
      )}
    </div>
  );
}
