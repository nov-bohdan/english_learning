import { WordInfo } from "@/lib/practiceWords/types";

export default function Word({ word }: { word: WordInfo }) {
  return (
    <div className="">
      {word.word} ({word.part_of_speech})
    </div>
  );
}
