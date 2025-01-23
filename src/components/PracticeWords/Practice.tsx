"use client";

import { WordInfo } from "@/lib/practiceWords/types";
import { useEffect, useState } from "react";
export default function Practice() {
  const [wordsToPractice, setWordsToPractice] = useState<WordInfo[]>([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState<number>(0);
  const currentWord = wordsToPractice[currentPracticeIndex];

  useEffect(() => {
    async function fetchWords() {
      const res = await fetch("/get_words");
      console.log(res);
      const words = await res.json();
      setWordsToPractice(words);
    }
    fetchWords();
  }, []);

  if (wordsToPractice.length === 0) {
    return <h1 className="font-semibold text-3xl">No words to practice</h1>;
  }

  return (
    <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4">
      <h1 className="font-semibold text-3xl">Practice</h1>
      <div className="border-2 border-gray-400 rounded-md p-4 flex flex-col items-center bg-blue-200">
        <h2 className="font-semibold">
          Word: {currentWord.word}{" "}
          <span className="italic text-sm font-normal">
            ({currentWord.part_of_speech})
          </span>
        </h2>
        <form>
          <div className="flex flex-col gap-2">
            <label htmlFor="definition_or_translation">
              Write a translation or a definition of the word on any language
            </label>
            <input
              type="text"
              name="definition_or_translation"
              className="p-4 border-2 border-gray-200 rounded-md"
            />
            <button
              type="submit"
              className="bg-blue-500 rounded-md p-4 text-white font-semibold text-lg"
            >
              Check
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
