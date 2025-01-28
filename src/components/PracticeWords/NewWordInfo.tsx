import { saveWords } from "@/lib/practiceWords/actions";
import { RawWordInfoInsert, RawWordInfoRow } from "@/lib/practiceWords/types";
import { useActionState, useEffect } from "react";

export default function NewWordInfo({
  wordInfo,
  onAddNewWord,
}: {
  wordInfo: RawWordInfoInsert;
  onAddNewWord: (newWords: RawWordInfoRow[]) => void;
}) {
  const [saveWordState, saveWordAction, saveWordIsPending] = useActionState(
    saveWords.bind(null, [wordInfo]),
    undefined
  );

  useEffect(() => {
    if (!saveWordState) return;

    onAddNewWord(saveWordState);
  }, [saveWordState, onAddNewWord]);

  return (
    <div className="flex flex-col gap-2 bg-gray-200 rounded-md p-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">
          {wordInfo.word}{" "}
          <span className="italic text-sm">({wordInfo.part_of_speech})</span>
        </h2>
        <form action={saveWordAction}>
          <button
            type="submit"
            disabled={saveWordIsPending}
            className="bg-blue-500 p-2 rounded-md text-lg text-white disabled:bg-gray-400 disabled:bg-opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Save word
          </button>
        </form>
      </div>
      <p className="font-semibold">{wordInfo.translation}</p>
      <p>
        <b>Definition:</b>
        <br />
        {wordInfo.definition.definition}
        <br />
        {wordInfo.definition.translation}
      </p>
      <div>
        <b>Examples:</b>
        {wordInfo.examples.map((example) => {
          return (
            <p key={example.example}>
              {example.example} - {example.translation}
            </p>
          );
        })}
      </div>
      <p>
        <b>Synonyms:</b>
        <br />
        {wordInfo.synonyms.join(", ")}
      </p>
      <div>
        <b>Collocations:</b>
        <br />
        {wordInfo.collocations.map((collocation) => {
          return (
            <p key={collocation.collocation}>
              {collocation.collocation} - {collocation.translation}
            </p>
          );
        })}
      </div>
      <div>
        <b>When to use:</b>
        <br />
        {wordInfo.when_to_use.map((scenario) => {
          return (
            <p key={scenario.scenario}>
              {scenario.scenario} - {scenario.translation}
            </p>
          );
        })}
      </div>
    </div>
  );
}
