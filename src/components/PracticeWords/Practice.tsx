"use client";

import { createTask } from "@/lib/practiceWords/createTasks";
import { WordInfo } from "@/lib/practiceWords/types";
import { useEffect, useState } from "react";
export default function Practice() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wordsToPractice, setWordsToPractice] = useState<WordInfo[]>([]);

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

  const [currentTaskCompleted, setCurrentTaskCompleted] =
    useState<boolean>(false);
  const tasks = wordsToPractice.map((word, index) =>
    createTask(word, "EN_RU", () => setCurrentTaskCompleted(true), index)
  );
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);

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
      {tasks[currentTaskIndex]}
      {currentTaskCompleted && (
        <button
          type="button"
          className="bg-yellow-500 rounded-md p-4 text-white font-semibold text-lg w-full"
          onClick={() => {
            if (currentTaskIndex + 1 >= tasks.length) {
              return;
            }
            setCurrentTaskCompleted(false);
            setCurrentTaskIndex((i) => i + 1);
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}
