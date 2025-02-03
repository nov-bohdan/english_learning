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
  const containerClasses =
    "rounded-lg shadow-md p-6 w-full transition-all duration-300 bg-green-50 border border-green-300";

  if (isExtended && answerState) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-xl font-bold text-green-700">Correct Answer</h3>
        </div>
        <p className="mb-4 text-green-700">
          Your answer is correct! Your grade for this answer is{" "}
          <span className="font-bold">{answerState.grade}%</span>.
        </p>
        {answerState.mistakes.length > 0 && (
          <>
            <p className="mb-2 text-green-700">Here are some corrections:</p>
            <ul className="list-disc pl-5 mb-4 text-green-700">
              {answerState.mistakes.map((mistake) => (
                <li key={mistake.mistake}>
                  <span className="font-medium">{mistake.mistake}:</span>{" "}
                  {mistake.translation}
                </li>
              ))}
            </ul>
            <p className="text-green-700">
              Corrected sentence:{" "}
              <span className="font-semibold">
                {answerState.correct_sentence}
              </span>
            </p>
          </>
        )}
      </div>
    );
  } else {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-xl font-bold text-green-700">Correct Answer</h3>
        </div>
        <p className="text-green-700">Your answer is correct!</p>
      </div>
    );
  }
}
