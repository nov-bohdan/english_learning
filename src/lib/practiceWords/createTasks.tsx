import { Task, WordInfo } from "./types";
import EnRuTask from "./tasks/EnRuTask";
import RuEnTask from "./tasks/RuEnTask";

export function createTask(
  word: WordInfo,
  task: Task,
  callback: () => void,
  index: number
) {
  switch (task.task_type) {
    case "EN_RU":
      return (
        <EnRuTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
        />
      );
    case "RU_EN":
      return (
        <RuEnTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
        />
      );
    default:
      return (
        <EnRuTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
        />
      );
  }
}
