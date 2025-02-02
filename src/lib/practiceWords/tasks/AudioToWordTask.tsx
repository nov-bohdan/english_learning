import { checkAudioToWord } from "../actions";
import { Task, RawWordInfoRow } from "../types";
import AudioIcon from "@/components/Icons/AudioIcon";
import TaskTemplate from "./TaskTemplate";

export default function AudioToWordTask({
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
      header={
        <span className="flex flex-col gap-1 items-center">
          Audio: <AudioIcon audioUrl={word.word_audio} />
        </span>
      }
      taskDefinition="Listen to the word and write it down"
      correctAnswer={word.word}
      callback={callback}
      action={checkAudioToWord.bind(null, word, task)}
    />
  );
}
