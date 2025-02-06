import {
  markWordAsNeverShow,
  markWordAsToLearn,
} from "@/lib/practiceWords/actions";
import { useState } from "react";

type WordCard = {
  id: number;
  word: string;
  level: string;
  translation: string;
};

export default function WordCard({ word }: { word: WordCard }) {
  const [status, setStatus] = useState<
    "to_learn" | "never_show" | "saving" | null
  >(null);

  const handleNeverShow = () => {
    markWordAsNeverShow(word.id);
    setStatus("never_show");
  };

  const handleToLearn = async () => {
    setStatus("saving");
    await markWordAsToLearn(word.id, word.word);
    setStatus("to_learn");
  };

  const isArchivedStyles =
    status === "never_show"
      ? "bg-gray-500"
      : status === "to_learn"
      ? "bg-green-100"
      : "bg-white";

  return (
    <div
      className={`p-4 rounded-lg shadow-sm shadow-gray-500 flex flex-col gap-3 w-full ${isArchivedStyles}`}
    >
      <div className="flex flex-row justify-between items-center font-semibold">
        <p>{word.word}</p>
        <p>{word.translation}</p>
      </div>
      <hr />
      <div className="flex flex-row justify-between items-center gap-2 text-xs">
        <button
          className="bg-red-200 text-red-600 rounded-lg py-4 px-4 font-semibold disabled:bg-gray-800 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          onClick={handleNeverShow}
          disabled={["never_show", "saving"].includes(status || "")}
        >
          Больше не показывать
        </button>
        <button
          className="bg-green-200 text-green-600 rounded-lg py-4 px-4 font-semibold disabled:bg-gray-800 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:text-white"
          onClick={handleToLearn}
          disabled={["to_learn", "saving"].includes(status || "")}
        >
          {status === "saving" && "Сохранение..."}
          {status === "to_learn" && "Сохранено"}
          {status === "never_show" || (status === null && "Хочу выучить")}
        </button>
      </div>
    </div>
  );
}
