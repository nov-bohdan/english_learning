"use client";

import { createTask } from "@/lib/practiceWords/createTasks";
import { Task } from "@/lib/practiceWords/types";
import { useEffect, useState } from "react";

function shuffle(array: unknown[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export default function Practice() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tasksToPractice, setTasksToPractice] = useState<Task[]>([]);
  const wordsToPractice = new Set(tasksToPractice.map((task) => task.word.id))
    .size;

  useEffect(() => {
    async function fetchWords() {
      setIsLoading(true);
      const res = await fetch("/get_tasks_to_show");
      const tasks: Task[] = await res.json();
      shuffle(tasks);
      setTasksToPractice(tasks);
      console.log(tasks);
      setIsLoading(false);
    }
    fetchWords();
  }, []);

  const taskElements = tasksToPractice.map((task, index) =>
    createTask(task.word, task, () => setCurrentTaskCompleted(true), index)
  );
  const [currentTaskCompleted, setCurrentTaskCompleted] =
    useState<boolean>(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);

  if (isLoading) {
    return (
      <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4 w-full">
        <h1 className="font-semibold text-3xl">Loading...</h1>
      </div>
    );
  }

  if (tasksToPractice.length === 0) {
    return (
      <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4 w-full">
        <h1 className="font-semibold text-3xl">No words to practice</h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4 w-full">
      <h1 className="font-semibold text-3xl">
        Practice ({wordsToPractice} words)
      </h1>
      {taskElements[currentTaskIndex]}
      {currentTaskCompleted && (
        <button
          type="button"
          className="bg-yellow-500 rounded-md p-4 text-white font-semibold text-lg w-full"
          onClick={() => {
            if (currentTaskIndex + 1 >= taskElements.length) {
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
