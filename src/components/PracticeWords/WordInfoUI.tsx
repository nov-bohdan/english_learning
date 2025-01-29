import { RawWordInfoInsert, WordInfo } from "@/lib/practiceWords/types";
import EnglishLevelIcon from "./EnglishLevelIcon";

export default function WordInfoUI({
  wordInfo,
  children,
}: {
  wordInfo: RawWordInfoInsert | WordInfo;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 bg-gray-200 rounded-md p-4 w-3/4">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-xl font-semibold">{wordInfo.word} </h2>
            <span className="italic text-sm">({wordInfo.part_of_speech})</span>
            <EnglishLevelIcon englishLevel={wordInfo.english_level} />
          </div>
          <div className="">
            <p>{wordInfo.transcription}</p>
          </div>
        </div>
        {children}
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
    </div>
  );
}
