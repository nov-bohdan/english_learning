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
  isExtendedResult = false,
}: {
  word: RawWordInfoRow;
  header: string | React.ReactNode;
  taskDefinition: string;
  callback: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (...args: any[]) => any;
  correctAnswer?: string;
  isExtendedResult?: boolean;
}) {
  const [isShowingAnswer, setIsShowingAnswer] = useState<boolean>(false);
  const [
    checkUserAnswerState,
    checkUserAnswerAction,
    checkUserAnswerIsPending,
  ] = useActionState(action, undefined);

  useEffect(() => {
    console.log(checkUserAnswerState);
    if (checkUserAnswerState?.success) {
      console.log("show");
      setIsShowingAnswer(true);
      callback();
    }
  }, [checkUserAnswerState, callback]);

  useEffect(() => {
    const audio = new Audio(word.word_audio);
    audio.play();
  }, [word.word_audio]);

  return (
    <>
      <div className="border-2 border-gray-400 rounded-md p-4 flex flex-col items-center bg-blue-200 gap-2">
        <h2 className="font-semibold flex flex-row items-center gap-1">
          {header}{" "}
          <span className="italic text-sm font-normal">
            ({word.part_of_speech})
          </span>
        </h2>
        {checkUserAnswerState?.error && (
          <Error message={checkUserAnswerState.error} />
        )}
        {(!checkUserAnswerState?.data || !isShowingAnswer) && (
          <form action={checkUserAnswerAction} autoComplete="off">
            <div className="flex flex-col gap-2 items-center">
              <label htmlFor="answer">{taskDefinition}</label>
              <input
                type="text"
                name="answer"
                id="answer"
                className="w-full p-4 border-2 border-gray-200 rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 rounded-md p-4 text-white font-semibold text-lg disabled:bg-gray-400 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                disabled={checkUserAnswerIsPending}
              >
                Check
              </button>
            </div>
          </form>
        )}
        {checkUserAnswerState?.success && isShowingAnswer && (
          <>
            {checkUserAnswerState.data.grade >= 80 && (
              <CorrectAnswer
                isExtended={isExtendedResult}
                answerState={checkUserAnswerState}
              />
            )}
            {checkUserAnswerState.data.grade < 80 && (
              <IncorrectAnswer
                correctAnswer={correctAnswer}
                answerState={checkUserAnswerState}
                isExtended={isExtendedResult}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
