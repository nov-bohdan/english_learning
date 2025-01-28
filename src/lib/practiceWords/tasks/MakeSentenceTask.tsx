import { useState, useActionState, useEffect } from "react";
import { checkMakeSentence } from "../actions";
import { Task, RawWordInfoRow } from "../types";

export default function MakeSentenceTask({
  word,
  task,
  callback,
}: {
  word: RawWordInfoRow;
  task: Task;
  callback: () => void;
}) {
  const TASK_DESCRIPTION =
    `Составьте предложение со словом “${word.word}” (${word.part_of_speech}), используя минимум 6 слов.
    Пример: “Every morning, I take the early train from my hometown to the city”` as const;
  const [isShowingAnswer, setIsShowingAnswer] = useState<boolean>(false);
  const [
    checkUserAnswerState,
    checkUserAnswerAction,
    checkUserAnswerIsPending,
  ] = useActionState(
    checkMakeSentence.bind(
      null,
      task.id,
      task.progress_id,
      task.score,
      TASK_DESCRIPTION
    ),
    undefined
  );

  useEffect(() => {
    if (checkUserAnswerState) {
      setIsShowingAnswer(true);
      callback();
    }
  }, [checkUserAnswerState, callback]);

  return (
    <div className="border-2 border-gray-400 rounded-md p-4 flex flex-col items-center bg-blue-200 gap-2">
      <h2 className="font-semibold">
        Word: {word.word}{" "}
        <span className="italic text-sm font-normal">
          ({word.part_of_speech})
        </span>
      </h2>
      {(!checkUserAnswerState || !isShowingAnswer) && (
        <form action={checkUserAnswerAction} autoComplete="off">
          <div className="flex flex-col gap-2 items-center">
            <label htmlFor="translation" className="whitespace-pre-wrap">
              <pre>{TASK_DESCRIPTION}</pre>
            </label>
            <input type="hidden" value={word.translation} name="word" />
            <input
              type="hidden"
              value={word.part_of_speech}
              name="part_of_speech"
            />
            <input
              type="text"
              name="sentence"
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
      {checkUserAnswerState && isShowingAnswer && (
        <>
          {checkUserAnswerState.grade >= 80 && (
            <div className="bg-green-400 rounded-md p-4 w-full">
              <p>
                Your answer is correct! Your grade for this answer is{" "}
                {checkUserAnswerState.grade}%
              </p>
              {checkUserAnswerState.mistakes.length > 0 && (
                <>
                  <p>Here are some corrections:</p>
                  <ul>
                    {checkUserAnswerState.mistakes.map((mistake) => (
                      <li key={mistake.mistake}>
                        {mistake.mistake} - {mistake.translation}
                      </li>
                    ))}
                  </ul>
                  <p>
                    Corrected sentence: {checkUserAnswerState.correct_sentence}
                  </p>
                </>
              )}
            </div>
          )}
          {checkUserAnswerState.grade < 80 && (
            <div className="bg-red-400 rounded-md p-4 w-full">
              <p>
                Your answer is incorrect! Your grade for this answer is{" "}
                {checkUserAnswerState.grade}%. Your mistakes:
              </p>
              <ul>
                {checkUserAnswerState.mistakes.map((mistake) => (
                  <li key={mistake.mistake}>
                    {mistake.mistake} - {mistake.translation}
                  </li>
                ))}
              </ul>
              <p>Corrected sentence: {checkUserAnswerState.correct_sentence}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
