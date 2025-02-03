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
  // Optional: Remove console.log in production
  console.log(answerState);

  // Common styling for the error container
  const containerClasses =
    "rounded-lg shadow-md p-6 w-full transition-all duration-300 bg-red-50 border border-red-300";

  if (isExtended) {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h3 className="text-xl font-bold text-red-700">Incorrect Answer</h3>
        </div>
        <p className="mb-4 text-red-700">
          Your answer is incorrect! Your grade is{" "}
          <span className="font-bold">{answerState.grade}%</span>. Please review
          the following mistakes:
        </p>
        {answerState.mistakes && answerState.mistakes.length > 0 && (
          <ul className="list-disc pl-5 mb-4 text-red-700">
            {answerState.mistakes.map((mistake) => (
              <li key={mistake.mistake}>
                <span className="font-medium">{mistake.mistake}:</span>{" "}
                {mistake.translation}
              </li>
            ))}
          </ul>
        )}
        {answerState.correct_sentence && (
          <p className="text-red-700">
            Corrected sentence:{" "}
            <span className="font-semibold">
              {answerState.correct_sentence}
            </span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h3 className="text-xl font-bold text-red-700">Incorrect Answer</h3>
      </div>
      <p className="text-red-700">
        Your answer is incorrect! The correct answer is:{" "}
        <span className="font-bold">{correctAnswer}</span>.
      </p>
    </div>
  );
}
