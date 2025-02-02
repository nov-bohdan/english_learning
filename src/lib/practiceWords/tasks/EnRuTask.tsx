import { checkEnRuTranslation } from "../actions";
import { RawWordInfoRow, Task } from "../types";
import TaskTemplate from "./TaskTemplate";

export default function EnRuTask({
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
      header={`Word: ${word.word}`}
      taskDefinition="Write a translation or a definition of the word on any language"
      correctAnswer={word.translation}
      callback={callback}
      action={checkEnRuTranslation.bind(null, word, task)}
    />
  );
}
