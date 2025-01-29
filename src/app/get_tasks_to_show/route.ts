import dbWords from "@/lib/db/words";
import { Task } from "@/lib/practiceWords/types";
import { TASK_TYPES } from "@/lib/practiceWords/tasks/TaskTypes";

async function createTasksForWord(
  wordTasks: {
    id: number;
    last_practiced: string | null;
    progress_id: number;
    score: number;
    task_type: string;
  }[],
  wordProgressId: number
) {
  const savedTasks = [];
  for (const taskType of TASK_TYPES) {
    const matchingTask = wordTasks.find(
      (currentTask) => currentTask.task_type === taskType
    );
    if (!matchingTask) {
      // creating new user_task_progress
      const newTask = await dbWords.createNewUserTaskProgress(
        wordProgressId,
        taskType
      );
      savedTasks.push(newTask);
    }
  }
  return savedTasks;
}

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request): Promise<Response> {
  const taskTypesToUse: { task_types: (typeof TASK_TYPES)[number][] } =
    await request.json();
  const tasksToShow: Task[] = [];
  const wordProgresses = await dbWords.getWordsToPractice();
  for (const wordProgress of wordProgresses) {
    const wordTasks = await dbWords.getWordTaskProgresses(wordProgress.id);
    const newTasks = await createTasksForWord(wordTasks, wordProgress.id);
    wordTasks.push(...newTasks);
    for (const taskType of taskTypesToUse.task_types) {
      const matchingTask = wordTasks.find(
        (currentTask) => currentTask.task_type === taskType
      );
      tasksToShow.push({
        ...matchingTask,
        word: wordProgress.words,
        wordProgressId: wordProgress.id,
      });
    }
  }
  shuffle(tasksToShow);
  return Response.json(tasksToShow);
}
