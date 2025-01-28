import dbWords from "@/lib/db/words";
import { Task } from "@/lib/practiceWords/types";

const TASK_TYPES = ["EN_RU", "RU_EN", "MAKE_SENTENCE"] as const;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request): Promise<Response> {
  const tasksToShow: Task[] = [];
  const wordProgresses = await dbWords.getWordsToPractice();
  for (const wordProgress of wordProgresses) {
    const wordTasks = await dbWords.getWordTaskProgresses(wordProgress.id);
    for (const taskType of TASK_TYPES) {
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
