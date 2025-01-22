"use client";

import { useActionState } from "react";
import NewWordForm from "./NewWordForm";
import { getWordInfo } from "@/lib/practiceWords/actions";
import NewWordInfo from "./NewWordInfo";
export default function PracticeWordsPage() {
  const [wordInfoState, wordInfoAction, wordInfoPending] = useActionState(
    getWordInfo,
    undefined
  );
  return (
    <div className="flex flex-col gap-4">
      {/* ADDING NEW WORD */}
      <div className="bg-gray-200 rounded-md p-4">
        <NewWordForm
          wordInfoAction={wordInfoAction}
          wordInfoPending={wordInfoPending}
        />
      </div>
      {/* NEW WORD INFO */}
      {wordInfoState?.map((wordInfo, index) => {
        return <NewWordInfo key={index} wordInfo={wordInfo} />;
      })}
    </div>
  );
}
