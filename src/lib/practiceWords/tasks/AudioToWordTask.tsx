import { checkAudioToWord } from "../actions";
import { Task, RawWordInfoRow } from "../types";
import AudioIcon from "@/components/Icons/AudioIcon";
import TaskTemplate from "./TaskTemplate";

export default function AudioToWordTask({
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
      header={
        <>
          Audio: <AudioIcon audioUrl={word.word_audio} />
        </>
      }
      taskDefinition="Listen to the word and write it down"
      correctAnswer={word.word}
      callback={callback}
      action={checkAudioToWord.bind(null, word, task)}
      addNewTaskToCurrentPractice={addNewTaskToCurrentPractice}
    />
  );
}
