import { checkMakeSentence } from "../actions";
import { Task, RawWordInfoRow } from "../types";
import TaskTemplate from "./TaskTemplate";

export default function MakeSentenceTask({
  word,
  task,
  callback,
  addNewTaskToCurrentPractice,
}: {
  word: RawWordInfoRow;
  task: Task;
  callback: () => void;
  addNewTaskToCurrentPractice: () => Promise<void>;
}) {
  const TASK_DESCRIPTION =
    `Составьте предложение со словом “${word.word}” (${word.part_of_speech}), используя минимум 6 слов.
    Пример: “Every morning, I take the early train from my hometown to the city”` as const;

  return (
    <TaskTemplate
      word={word}
      header={`Word: ${word.word}`}
      taskDefinition={TASK_DESCRIPTION}
      callback={callback}
      action={checkMakeSentence.bind(null, word, task, TASK_DESCRIPTION)}
      isExtendedResult={true}
      addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
    />
  );
}
