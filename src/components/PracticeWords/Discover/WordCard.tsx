import {
  markWordAsNeverShow,
  markWordAsToLearn,
} from "@/lib/practiceWords/actions";
import { useState } from "react";

type WordCardType = {
  id: number;
  word: string;
  level: string;
  translation: string;
};

export default function WordCard({ word }: { word: WordCardType }) {
  const [status, setStatus] = useState<
    "to_learn" | "never_show" | "saving" | null
  >(null);

  const handleNeverShow = () => {
    markWordAsNeverShow(word.id);
    setStatus("never_show");
  };

  const handleToLearn = async () => {
    console.log(`Handle to learn word: ${word.word}`);
    setStatus("saving");
    // await markWordAsToLearn(word.id, word.word);
    await fetch("/mark_word_to_learn", {
      method: "POST",
      body: JSON.stringify({ word: word.word, wordId: word.id }),
    });
    setStatus("to_learn");
  };

  const bgColor =
    status === "never_show"
      ? "bg-gray-300"
      : status === "to_learn"
      ? "bg-green-100"
      : "bg-white";

  return (
    <div
      className={`p-4 rounded-lg shadow-sm flex flex-col gap-3 w-full transition-colors duration-300 ${bgColor}`}
    >
      <div className="flex justify-between items-center font-semibold text-gray-800">
        <p>{word.word}</p>
        <p>{word.translation}</p>
      </div>
      <hr className="border-gray-300" />
      <div className="flex justify-between items-center gap-2 text-sm">
        <button
          className="bg-red-200 text-red-700 rounded-md py-2 px-4 font-semibold transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleNeverShow}
          disabled={status === "never_show" || status === "saving"}
        >
          Больше не показывать
        </button>
        <button
          className="bg-green-200 text-green-700 rounded-md py-2 px-4 font-semibold transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleToLearn}
          disabled={status === "to_learn" || status === "saving"}
          type="button"
        >
          {status === "saving"
            ? "Сохранение..."
            : status === "to_learn"
            ? "Сохранено"
            : "Хочу выучить"}
        </button>
      </div>
    </div>
  );
}
