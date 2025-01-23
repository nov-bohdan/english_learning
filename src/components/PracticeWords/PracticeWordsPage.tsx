"use client";

import { useActionState, useEffect, useState } from "react";
import NewWordForm from "./NewWordForm";
import { getWordInfo } from "@/lib/practiceWords/actions";
import NewWordInfo from "./NewWordInfo";
import { WordInfo } from "@/lib/practiceWords/types";
import Word from "./Word";
import { mapRawRowToWords } from "@/lib/helpers/words";

export default function PracticeWordsPage({ words }: { words: WordInfo[] }) {
  const [wordsState, setWordsState] = useState<WordInfo[]>(words);

  const [getWordInfoState, getWordInfoAction, getWordInfoPending] =
    useActionState(getWordInfo, undefined);

  useEffect(() => {
    if (!getWordInfoState) return;

    const mappedWords = mapRawRowToWords(getWordInfoState);
    setWordsState((prevWordsState) => [...prevWordsState, ...mappedWords]);
  }, [getWordInfoState, words]);

  return (
    <div className="flex flex-row gap-4 w-full">
      {/* LEFT PANEL */}
      <div className="bg-gray-200 rounded-md p-4 w-1/4 max-h-[500px]">
        <h2 className="text-bold text-3xl">Saved words</h2>
        {wordsState.map((word) => (
          <Word key={`${word.word}-${word.part_of_speech}`} word={word} />
        ))}
      </div>
      {/* RIGHT PANEL */}
      <div className="flex flex-col gap-4 w-3/4">
        {/* ADDING NEW WORD */}
        <div className="bg-gray-200 rounded-md p-4">
          <NewWordForm
            getWordInfoAction={getWordInfoAction}
            getWordInfoPending={getWordInfoPending}
          />
        </div>
        {/* NEW WORD INFO */}
        {getWordInfoState?.map((wordInfo, index) => {
          return <NewWordInfo key={index} wordInfo={wordInfo} />;
        })}
      </div>
    </div>
  );
}
