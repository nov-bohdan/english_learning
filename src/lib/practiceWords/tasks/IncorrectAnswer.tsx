export default function IncorrectAnswer({
  answerState,
  correctAnswer,
  isExtended = false,
}: {
  answerState: {
    grade: number;
    mistakes?: { mistake: string; translation: string }[];
    correct_sentence?: string;
  };
  correctAnswer?: string;
  isExtended?: boolean;
}) {
  if (isExtended) {
    return (
      <div className="bg-red-400 rounded-md p-4 w-full">
        <p>
          Your answer is incorrect! Your grade for this answer is{" "}
          {answerState.grade}%. Your mistakes:
        </p>
        <ul>
          {answerState.mistakes?.map((mistake) => (
            <li key={mistake.mistake}>
              {mistake.mistake} - {mistake.translation}
            </li>
          ))}
        </ul>
        <p>Corrected sentence: {answerState.correct_sentence}</p>
      </div>
    );
  }
  return (
    <div className="bg-red-400 rounded-md p-4 w-full">
      <p>
        Your answer is incorrect! Your grade for this answer is{" "}
        {answerState.grade}%. Correct answer is:{" "}
        <span className="font-bold">{correctAnswer}</span>
      </p>
    </div>
  );
}
