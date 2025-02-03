"use client";

import { createTask } from "@/lib/practiceWords/createTasks";
import { RawWordInfoRow, Task } from "@/lib/practiceWords/types";
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

  const addNewTaskToCurrentPractice = useCallback(
    async (taskType: string, wordProgressId: number, word: RawWordInfoRow) => {
      const res = await fetch("/get_tasks_to_show", {
        method: "POST",
        body: JSON.stringify({
          task_types: [taskType],
          wordProgressId: wordProgressId,
          word: word,
        }),
      });

      const task: Task = (await res.json())[0];
      setTasksToPractice((oldTasks) => [...oldTasks, task]);
    },
    []
  );

  const [currentTaskCompleted, setCurrentTaskCompleted] =
    useState<boolean>(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);

  const taskElements = tasksToPractice.map((task, index) =>
    createTask(
      task.word,
      task,
      () => setCurrentTaskCompleted(true),
      index,
      () =>
        addNewTaskToCurrentPractice(task.task_type, task.progress_id, task.word)
    )
  );

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

  // Common container classes used across states
  const containerClasses =
    "w-full max-w-2xl mx-auto p-6 rounded-xl shadow-lg transition-all duration-300";
  const bgGradient = "bg-gradient-to-br from-gray-100 to-gray-200";

  if (!isStarted) {
    return (
      <div
        className={`${containerClasses} ${bgGradient} flex flex-col items-center gap-6`}
      >
        <h2 className="font-semibold text-2xl text-gray-800 text-center">
          Choose what types of tasks you want to practice
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {selectedTasks.map((task) => (
            <div
              key={task.taskName}
              className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm"
            >
              <input
                id={task.taskName}
                type="checkbox"
                value={task.taskName}
                checked={task.enabled}
                name={task.taskName}
                onChange={() =>
                  handleSelectedTasksChange(task.taskName, !task.enabled)
                }
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={task.taskName} className="text-gray-700">
                {TASK_TYPES_MAP[task.taskName]}
              </label>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleStartPractice}
          disabled={selectedTasksCount === 0}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xl font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Start Practice
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`${containerClasses} ${bgGradient} flex flex-col items-center gap-6`}
      >
        <h1 className="font-semibold text-3xl text-gray-800">Loading...</h1>
      </div>
    );
  }

  if (tasksToPractice.length === 0) {
    return (
      <div
        className={`${containerClasses} ${bgGradient} flex flex-col items-center gap-6`}
      >
        <h1 className="font-semibold text-3xl text-gray-800">
          No words to practice
        </h1>
      </div>
    );
  }

  if (wordsToPractice < 5) {
    return (
      <div
        className={`${containerClasses} ${bgGradient} flex flex-col items-center gap-6`}
      >
        <h1 className="font-semibold text-3xl text-gray-800 text-center">
          You have only {wordsToPractice} words to practice right now. You need
          at least 5 to start practice.
        </h1>
      </div>
    );
  }

  return (
    <div
      className={`${containerClasses} ${bgGradient} flex flex-col items-center gap-6`}
    >
      <h1 className="font-bold text-3xl text-gray-900">
        Practice ({wordsToPractice} words)
      </h1>
      <div className="w-full transition-opacity duration-500">
        {taskElements[currentTaskIndex]}
      </div>
      {currentTaskCompleted &&
        currentTaskIndex + 1 < tasksToPractice.length && (
          <button
            type="button"
            onClick={handleNextTask}
            className="w-full px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-lg font-semibold transition-colors"
          >
            Next
          </button>
        )}
      {currentTaskCompleted &&
        currentTaskIndex + 1 >= tasksToPractice.length && (
          <button
            type="button"
            onClick={onFinishPractice}
            className="w-full px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-lg font-semibold transition-colors"
          >
            Finish Practice
          </button>
        )}
    </div>
  );
}
