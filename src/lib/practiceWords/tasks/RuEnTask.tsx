import { checkRuEnTranslation } from "../actions";
import { Task, RawWordInfoRow } from "../types";
import TaskTemplate from "./TaskTemplate";

export default function RuEnTask({
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
  return (
    <TaskTemplate
      word={word}
      header={`Word: ${word.translation}`}
      taskDefinition="Translate this word to English"
      correctAnswer={word.word}
      callback={callback}
      action={checkRuEnTranslation.bind(null, word, task)}
      playAudio={false}
      addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
    />
  );
}
