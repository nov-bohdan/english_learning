import { discoverNewVords } from "@/lib/practiceWords/actions";
import { useActionState } from "react";
import WordCard from "./WordCard";

export default function DiscoverNewWords() {
  const [state, action, pending] = useActionState(discoverNewVords, undefined);
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 flex flex-col items-center">
        <form action={action}>
          <button
            type="submit"
            className="bg-blue-500 py-4 px-8 text-white font-semibold rounded-lg disabled:bg-gray-500 disabled:bg-opacity-50 disabled:cursor-not-allowed"
            disabled={pending}
          >
            Discover
          </button>
        </form>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {state && state.map((word) => <WordCard key={word.id} word={word} />)}
      </div>
    </div>
  );
}
