"use client";

import { createTask } from "@/lib/practiceWords/createTasks";
import { Task } from "@/lib/practiceWords/types";
import { useState } from "react";
import { TASK_TYPES } from "@/lib/practiceWords/tasks/TaskTypes";

const TASK_TYPES_MAP: Record<(typeof TASK_TYPES)[number], string> = {
  EN_RU: "English to Russian",
  RU_EN: "Russian to English",
  MAKE_SENTENCE: "Make sentence",
  DEFINITION_TO_EN: "Definition to English",
};

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

export default function Practice({
  onFinishPractice,
}: {
  onFinishPractice: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [tasksToPractice, setTasksToPractice] = useState<Task[]>([]);
  const wordsToPractice = new Set(tasksToPractice.map((task) => task.word.id))
    .size;
  const [selectedTasks, setSelectedTasks] = useState<
    { taskName: (typeof TASK_TYPES)[number]; enabled: boolean }[]
  >(TASK_TYPES.map((task_type) => ({ taskName: task_type, enabled: true })));

  // useEffect(() => {
  //   async function fetchWords() {
  //     setIsLoading(true);
  //     const res = await fetch("/get_tasks_to_show");
  //     const tasks: Task[] = await res.json();
  //     shuffle(tasks);
  //     setTasksToPractice(tasks);
  //     console.log(tasks);
  //     setIsLoading(false);
  //   }
  //   fetchWords();
  // }, []);

  const handleStartPractice = () => {
    async function fetchWords() {
      setIsLoading(true);
      setIsStarted(true);
      const taskTypesToShow = selectedTasks
        .filter((task) => task.enabled)
        .map((task) => task.taskName);
      const res = await fetch("/get_tasks_to_show", {
        method: "POST",
        body: JSON.stringify({ task_types: taskTypesToShow }),
      });
      const tasks: Task[] = await res.json();
      shuffle(tasks);
      setTasksToPractice(tasks);
      console.log(tasks);
      setIsLoading(false);
    }
    fetchWords();
  };

  const handleSelectedTasksChange = (taskName: string, enabled: boolean) => {
    setSelectedTasks((oldSelected) => {
      const newTasks = [...oldSelected];
      const matchingTask = newTasks.find((task) => task.taskName === taskName);
      if (!matchingTask) {
        throw new Error("Task not found");
      }
      matchingTask.enabled = enabled;
      return newTasks;
    });
  };

  const taskElements = tasksToPractice.map((task, index) =>
    createTask(task.word, task, () => setCurrentTaskCompleted(true), index)
  );
  const [currentTaskCompleted, setCurrentTaskCompleted] =
    useState<boolean>(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);

  if (!isStarted) {
    return (
      <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4 w-full">
        <h2 className="text-semibold text-xl">
          Choose what types of tasks you want to practice now
        </h2>
        <div className="flex flex-row gap-4">
          {selectedTasks.map((task) => (
            <div key={task.taskName} className="flex flex-row gap-2">
              <label htmlFor={task.taskName}>
                {TASK_TYPES_MAP[task.taskName]}
              </label>
              <input
                type="checkbox"
                value={task.taskName}
                checked={task.enabled}
                name={task.taskName}
                onChange={() =>
                  handleSelectedTasksChange(task.taskName, !task.enabled)
                }
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          className="p-4 bg-blue-500 border-2 border-gray-300 rounded-md text-white text-xl"
          onClick={handleStartPractice}
        >
          Start practice
        </button>
      </div>
    );
  }

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
      {currentTaskCompleted && currentTaskIndex + 1 < tasksToPractice.length ? (
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
      ) : (
        <button
          type="button"
          className="bg-orange-500 rounded-md p-4 text-white font-semibold text-lg w-full"
          onClick={onFinishPractice}
        >
          Finish practice
        </button>
      )}
    </div>
  );
}
