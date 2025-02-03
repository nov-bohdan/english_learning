"use client";

import { WordInfo } from "@/lib/practiceWords/types";
import ProgressBar from "./ProgressBar";
import { DateTime } from "luxon";
import EnglishLevelIcon from "./EnglishLevelIcon";
import {
  TASK_TYPES,
  TASK_TYPES_MAP,
} from "@/lib/practiceWords/tasks/TaskTypes";
import InfoIcon from "../Icons/InfoIcon";
import TooltipWrapper from "../Tooltip";

const getShapeForProgress = (progress: number) => {
  let color = "";
  if (progress < 33) {
    color = "bg-red-500";
  } else if (progress < 66) {
    color = "bg-yellow-500";
  } else {
    color = "bg-green-500";
  }
  return <span className={`rounded-full w-2 h-2 inline-block ${color}`}></span>;
};

export default function WordListItem({
  word,
  onShowDetails,
}: {
  word: WordInfo;
  onShowDetails: () => void;
}) {
  const diff = DateTime.fromISO(word.next_review_date)
    .diffNow(["hours", "minutes"])
    .toObject();
  const hoursDiff = diff.hours || 0;
  const minsDiff = Math.ceil(diff.minutes || 0);
  return (
    <div className="flex flex-col gap-2 border-b-2 border-b-gray-400 p-2">
      <div className="flex flex-row gap-2 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <h2 className="text-xl font-semibold">{word.word} </h2>
          <span className="italic text-sm">({word.part_of_speech})</span>
          <EnglishLevelIcon englishLevel={word.english_level} />
        </div>
        <div className="">
          <button
            type="button"
            className="py-1 px-2 bg-orange-400 rounded-md text-white font-semibold"
            onClick={onShowDetails}
          >
            Details
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center">
          <ProgressBar progress={word.avgProgress} />
        </div>
        <div className="flex flex-row gap-2 items-center">
          {TASK_TYPES.map((taskType) => (
            <p key={taskType} className="text-xs">
              {taskType.split("_")[0][0]}
              {taskType.split("_")[taskType.split("_").length - 1][0]}-
              {getShapeForProgress(word.progress[taskType])}
            </p>
          ))}
          <TooltipWrapper
            tooltipContent={
              <div>
                {TASK_TYPES.map((taskType) => (
                  <p key={`${taskType}-2`} className="text-xs">
                    {TASK_TYPES_MAP[taskType]} - {word.progress[taskType]}/100
                  </p>
                ))}
              </div>
            }
            place="top"
          >
            <span>
              <InfoIcon className="cursor-pointer" />
            </span>
          </TooltipWrapper>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="">
          <p>
            Next review in:{" "}
            {minsDiff > 0 ? `${hoursDiff} hr ${minsDiff} mins` : "NOW"}
          </p>
        </div>
      </div>
    </div>
  );
}
