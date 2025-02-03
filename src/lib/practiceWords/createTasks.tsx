import { RawWordInfoRow, Task } from "./types";
import EnRuTask from "./tasks/EnRuTask";
import RuEnTask from "./tasks/RuEnTask";
import MakeSentenceTask from "./tasks/MakeSentenceTask";
import DefinitionToEnTask from "./tasks/DefinitionToEnTask";
import AudioToWordTask from "./tasks/AudioToWordTask";

export function createTask(
  word: RawWordInfoRow,
  task: Task,
  callback: () => void,
  index: number,
  addNewTaskToCurrentPractice: () => Promise<void>
) {
  switch (task.task_type) {
    case "EN_RU":
      return (
        <EnRuTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
          addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
        />
      );
    case "RU_EN":
      return (
        <RuEnTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
          addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
        />
      );
    case "MAKE_SENTENCE":
      return (
        <MakeSentenceTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
          addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
        />
      );
    case "DEFINITION_TO_EN":
      return (
        <DefinitionToEnTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
          addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
        />
      );
    case "AUDIO_TO_WORD":
      return (
        <AudioToWordTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
          addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
        />
      );
    default:
      return (
        <EnRuTask
          key={`${word}-${index}`}
          word={word}
          task={task}
          callback={callback}
          addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
        />
      );
  }
}
