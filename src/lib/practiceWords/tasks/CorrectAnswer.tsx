export default function CorrectAnswer({
  isExtended = false,
  answerState,
}: {
  isExtended?: boolean;
  answerState?: {
    grade: number;
    mistakes: { mistake: string; translation: string }[];
    correct_sentence: string;
  };
}) {
  if (isExtended && answerState) {
    return (
      <div className="bg-green-400 rounded-md p-4 w-full">
        <p>
          Your answer is correct! Your grade for this answer is{" "}
          {answerState.grade}%
        </p>
        {answerState.mistakes.length > 0 && (
          <>
            <p>Here are some corrections:</p>
            <ul>
              {answerState.mistakes.map((mistake) => (
                <li key={mistake.mistake}>
                  {mistake.mistake} - {mistake.translation}
                </li>
              ))}
            </ul>
            <p>Corrected sentence: {answerState.correct_sentence}</p>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className="bg-green-400 rounded-md p-4 w-full">
        <p>Your answer is correct!</p>
      </div>
    );
  }
}
