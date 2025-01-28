import dbWords from "@/lib/db/words";
import { Task } from "@/lib/practiceWords/types";
import { TASK_TYPES } from "@/lib/practiceWords/tasks/TaskTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request): Promise<Response> {
  const taskTypesToUse: { task_types: (typeof TASK_TYPES)[number][] } =
    await request.json();
  const tasksToShow: Task[] = [];
  const wordProgresses = await dbWords.getWordsToPractice();
  for (const wordProgress of wordProgresses) {
    const wordTasks = await dbWords.getWordTaskProgresses(wordProgress.id);
    for (const taskType of taskTypesToUse.task_types) {
      const matchingTask = wordTasks.find(
        (currentTask) => currentTask.task_type === taskType
      );
      if (!matchingTask) {
        // creating new user_task_progress
        const createdTask = await dbWords.createNewUserTaskProgress(
          wordProgress.id,
          taskType
        );
        tasksToShow.push({
          ...createdTask,
          word: wordProgress.words,
          wordProgressId: wordProgress.id,
        });
      } else {
        tasksToShow.push({
          ...matchingTask,
          word: wordProgress.words,
          wordProgressId: wordProgress.id,
        });
      }
    }
  }
  return Response.json(tasksToShow);
}
