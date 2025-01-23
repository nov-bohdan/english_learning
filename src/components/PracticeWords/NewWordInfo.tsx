import { RawWordInfoRow } from "@/lib/practiceWords/types";

export default function NewWordInfo({
  wordInfo,
}: {
  wordInfo: RawWordInfoRow;
}) {
  return (
    <div className="flex flex-col gap-2 bg-gray-200 rounded-md p-4">
      <h2 className="text-xl font-semibold">{wordInfo.word}</h2>
      <p className="font-semibold">{wordInfo.translation}</p>
      <p>
        <b>Definition:</b>
        <br />
        {wordInfo.definition.definition}
        <br />
        {wordInfo.definition.translation}
      </p>
      <p className="italic">{wordInfo.part_of_speech}</p>
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
