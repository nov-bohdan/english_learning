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
    <div className="p-0 w-full bg-gray-200 rounded-md">
      <div className="flex flex-row gap-10 justify-center items-center">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex flex-row justify-center items-center w-full text-xl font-semibold gap-6">
            <p className="flex flex-row gap-2 items-center">
              <span className="rounded-full w-4 h-4 bg-red-500 block"></span>
              <span> Words: {wordsWithLowProgress}</span>
            </p>
            <p className="flex flex-row gap-2 items-center">
              <span className="rounded-full w-4 h-4 bg-yellow-500 block"></span>
              <span> Words: {wordsWithMediumProgress}</span>
            </p>
            <p className="flex flex-row gap-2 items-center">
              <span className="rounded-full w-4 h-4 bg-green-500 block"></span>
              <span> Words: {wordsWithHighProgress}</span>
            </p>
          </div>
          <p className="text-2xl font-semibold">Total: {words.length}</p>
        </div>

        <div className="flex flex-col justify-between italic">
          <p>Words ready to practice now: {wordsToPracticeNowCount}</p>
          <p>Words practiced today: {wordsNumberPracticedToday}</p>
          <p>New words added today: {savedWordsNumberByDate[0].count}</p>
        </div>

        <div className="">
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
