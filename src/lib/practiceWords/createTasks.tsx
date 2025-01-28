import { RawWordInfoRow, Task } from "./types";
import EnRuTask from "./tasks/EnRuTask";
import RuEnTask from "./tasks/RuEnTask";
import MakeSentenceTask from "./tasks/MakeSentenceTask";
import DefinitionToEnTask from "./tasks/DefinitionToEnTask";

export function createTask(
  word: RawWordInfoRow,
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
    case "MAKE_SENTENCE":
      return (
        <MakeSentenceTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
        />
      );
    case "DEFINITION_TO_EN":
      return (
        <DefinitionToEnTask
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
