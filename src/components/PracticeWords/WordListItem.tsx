"use client";

import { WordInfo } from "@/lib/practiceWords/types";
import ProgressBar from "./ProgressBar";
import { DateTime } from "luxon";
import EnglishLevelIcon from "./EnglishLevelIcon";

export default function WordListItem({ word }: { word: WordInfo }) {
  const diff = DateTime.fromISO(word.next_review_date)
    .diffNow(["hours", "minutes"])
    .toObject();
  const hoursDiff = diff.hours || 0;
  const minsDiff = Math.ceil(diff.minutes || 0);
  return (
    <div className="flex flex-col gap-2 border-b-2 border-b-gray-400 p-2">
      <div className="flex flex-row gap-2 items-center">
        <h2 className="text-xl font-semibold">{word.word} </h2>
        <span className="italic text-sm">({word.part_of_speech})</span>
        <EnglishLevelIcon englishLevel={word.english_level} />
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
