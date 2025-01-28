"use client";

import { WordInfo } from "@/lib/practiceWords/types";
import ProgressBar from "./ProgressBar";
import { DateTime } from "luxon";

export default function WordListItem({ word }: { word: WordInfo }) {
  const diff = DateTime.fromISO(word.next_review_date)
    .diffNow(["hours", "minutes"])
    .toObject();
  const hoursDiff = diff.hours || 0;
  const minsDiff = Math.ceil(diff.minutes || 0);
  return (
    <div className="flex flex-col gap-2 border-b-2 border-b-gray-400">
      <div className="">
        {word.word} ({word.part_of_speech})
      </div>
      <div className="flex flex-row ice">
        <ProgressBar progress={word.progress} /> {word.progress}%
      </div>
      <div className="">
        Next review in:{" "}
        {minsDiff > 0 ? `${hoursDiff} hr ${minsDiff} mins` : "NOW"}
      </div>
    </div>
  );
}
