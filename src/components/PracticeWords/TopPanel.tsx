import { WordInfo } from "@/lib/practiceWords/types";
import NewWordsChart from "./NewWordsChart";

export default function TopPanel({
  words,
  wordsToPracticeNowCount,
  wordsNumberPracticedToday,
  savedWordsNumberByDate,
}: {
  words: WordInfo[];
  wordsToPracticeNowCount: number;
  wordsNumberPracticedToday: number;
  savedWordsNumberByDate: { date: string; count: number }[];
}) {
  const wordsWithLowProgress = words.filter(
    (word) => word.avgProgress < 33
  ).length;
  const wordsWithMediumProgress = words.filter(
    (word) => word.avgProgress >= 33 && word.avgProgress < 66
  ).length;
  const wordsWithHighProgress = words.filter(
    (word) => word.avgProgress > 66
  ).length;

  return (
    <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Panel: Word Progress Counts */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row items-center gap-6 text-lg font-semibold text-gray-800">
            <div className="flex items-center gap-2">
              <span className="rounded-full w-4 h-4 bg-red-500"></span>
              <span>Low: {wordsWithLowProgress}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full w-4 h-4 bg-yellow-500"></span>
              <span>Medium: {wordsWithMediumProgress}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full w-4 h-4 bg-green-500"></span>
              <span>High: {wordsWithHighProgress}</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            Total Words: {words.length}
          </p>
        </div>

        {/* Middle Panel: Practice Stats */}
        <div className="flex flex-col gap-2 text-center text-gray-700">
          <p className="text-lg">
            <span className="font-semibold">Ready to Practice:</span>{" "}
            {wordsToPracticeNowCount}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Practiced Today:</span>{" "}
            {wordsNumberPracticedToday}
          </p>
          <p className="text-lg">
            <span className="font-semibold">New Words Today:</span>{" "}
            {savedWordsNumberByDate[savedWordsNumberByDate.length - 1]?.count ??
              0}
          </p>
        </div>

        {/* Right Panel: New Words Chart */}
        <div className="w-full md:w-auto">
          <NewWordsChart
            data={savedWordsNumberByDate}
            label="New words added"
            xAxisDataKey="date"
            seriesDataKey="count"
          />
        </div>
      </div>
    </div>
  );
}
