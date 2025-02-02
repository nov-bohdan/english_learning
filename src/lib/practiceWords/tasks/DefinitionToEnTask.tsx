import { checkDefinitionToEn } from "../actions";
import { RawWordInfoRow, Task } from "../types";
import TaskTemplate from "./TaskTemplate";

export default function DefinitionToEnTask({
  word,
  task,
  callback,
}: {
  word: RawWordInfoRow;
  task: Task;
  callback: () => void;
}) {
  return (
    <TaskTemplate
      word={word}
      header={`Definition: ${word.definition.definition} (
          ${word.definition.translation})`}
      taskDefinition="Write an English word that matches this definition"
      correctAnswer={word.word}
      callback={callback}
      action={checkDefinitionToEn.bind(null, word, task)}
      playAudio={false}
    />
  );
}
