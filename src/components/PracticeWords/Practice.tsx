"use client";

import { createTask } from "@/lib/practiceWords/createTasks";
import { Task } from "@/lib/practiceWords/types";
import { useCallback, useEffect, useState } from "react";
import {
  TASK_TYPES,
  TASK_TYPES_MAP,
} from "@/lib/practiceWords/tasks/TaskTypes";

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

  const selectedTasksCount = selectedTasks.filter(
    (task) => task.enabled
  ).length;

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
      console.log(tasks);
      setTasksToPractice(tasks);
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

  const handleNextTask = useCallback(() => {
    if (currentTaskCompleted) {
      if (currentTaskIndex + 1 < tasksToPractice.length) {
        setCurrentTaskCompleted(false);
        setCurrentTaskIndex((i) => i + 1);
      } else {
        onFinishPractice();
      }
    }
  }, [
    currentTaskCompleted,
    currentTaskIndex,
    onFinishPractice,
    tasksToPractice.length,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the Enter key is pressed
      if (e.key === "Enter") {
        handleNextTask();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTaskCompleted, currentTaskIndex, tasksToPractice, handleNextTask]);

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
          className="p-4 bg-blue-500 border-2 border-gray-300 rounded-md text-white text-xl cursor-pointer disabled:bg-gray-500 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          onClick={handleStartPractice}
          disabled={selectedTasksCount === 0}
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

  if (wordsToPractice < 5) {
    return (
      <div className="bg-gray-200 rounded-md p-4 flex flex-col items-center gap-4 w-full">
        <h1 className="font-semibold text-3xl">
          You have only {wordsToPractice} words to practice right now. You need
          at least 5 to start practice.
        </h1>
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
          onClick={handleNextTask}
        >
          Next
        </button>
      ) : currentTaskCompleted ? (
        <button
          type="button"
          className="bg-orange-500 rounded-md p-4 text-white font-semibold text-lg w-full"
          onClick={onFinishPractice}
        >
          Finish practice
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
