import { useState, useActionState, useEffect } from "react";
import { RawWordInfoRow } from "../types";
import CorrectAnswer from "./CorrectAnswer";
import IncorrectAnswer from "./IncorrectAnswer";
import Error from "@/components/Errors/Error";

export default function TaskTemplate({
  word,
  header,
  taskDefinition,
  callback,
  action,
  correctAnswer,
  addNewTaskToCurrentPractice,
  isExtendedResult = false,
  playAudio = true,
}: {
  word: RawWordInfoRow;
  header: string | React.ReactNode;
  taskDefinition: string;
  callback: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (...args: any[]) => any;
  correctAnswer?: string;
  isExtendedResult?: boolean;
  playAudio?: boolean;
  addNewTaskToCurrentPractice: () => Promise<void>;
}) {
  const [hasAddedNewTask, setHasAddedNewTask] = useState(false);
  const [isShowingAnswer, setIsShowingAnswer] = useState<boolean>(false);
  const [
    checkUserAnswerState,
    checkUserAnswerAction,
    checkUserAnswerIsPending,
  ] = useActionState(action, undefined);

  useEffect(() => {
    if (checkUserAnswerState?.success && !hasAddedNewTask) {
      setIsShowingAnswer(true);
      if (checkUserAnswerState.data.grade < 80) {
        addNewTaskToCurrentPractice();
        setHasAddedNewTask(true);
      }
      callback();
    }
  }, [
    checkUserAnswerState,
    callback,
    addNewTaskToCurrentPractice,
    hasAddedNewTask,
  ]);

  useEffect(() => {
    if (playAudio) {
      const audio = new Audio(word.word_audio);
      audio.play();
    }
  }, [word.word_audio, playAudio]);

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 rounded-lg p-6 shadow-lg transition transform hover:shadow-xl flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        {header}{" "}
        <span className="italic text-sm font-normal">
          ({word.part_of_speech})
        </span>
      </h2>

      {checkUserAnswerState?.error && (
        <div className="w-full">
          <Error message={checkUserAnswerState.error} />
        </div>
      )}

      {(!checkUserAnswerState?.data || !isShowingAnswer) && (
        <form
          action={checkUserAnswerAction}
          autoComplete="off"
          className="w-full"
        >
          <div className="flex flex-col gap-4 items-center">
            <label htmlFor="answer" className="text-lg font-medium">
              {taskDefinition}
            </label>
            <input
              type="text"
              name="answer"
              id="answer"
              className="w-full p-3 border-2 border-gray-300 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 transition ease-in-out duration-300 text-white font-semibold rounded-md p-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={checkUserAnswerIsPending}
            >
              Check
            </button>
          </div>
        </form>
      )}

      {checkUserAnswerState?.success && isShowingAnswer && (
        <div className="w-full transition-opacity duration-500 ease-in-out">
          {checkUserAnswerState.data.grade >= 80 ? (
            <CorrectAnswer
              isExtended={isExtendedResult}
              answerState={checkUserAnswerState.data}
            />
          ) : (
            <IncorrectAnswer
              correctAnswer={correctAnswer}
              answerState={checkUserAnswerState.data}
              isExtended={isExtendedResult}
            />
          )}
        </div>
      )}
    </div>
  );
}
