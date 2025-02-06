import { discoverNewVords } from "@/lib/practiceWords/actions";
import { useActionState } from "react";
import WordCard from "./WordCard";

export default function DiscoverNewWords() {
  const [state, action, pending] = useActionState(discoverNewVords, undefined);

  return (
    <div className="flex flex-col gap-8">
      {/* Discovery Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <form
          action={action}
          className="w-full flex flex-col gap-4 items-center"
        >
          <label
            htmlFor="level"
            className="text-lg font-semibold text-gray-700"
          >
            Select English Level
          </label>
          <select
            name="level"
            id="level"
            className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
          <button
            type="submit"
            className="w-full max-w-xs bg-blue-500 py-3 px-6 text-white font-semibold rounded-lg transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={pending}
          >
            Discover
          </button>
        </form>
      </div>

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state && state.map((word) => <WordCard key={word.id} word={word} />)}
      </div>
    </div>
  );
}
