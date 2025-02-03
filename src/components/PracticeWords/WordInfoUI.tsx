import { RawWordInfoInsert, WordInfo } from "@/lib/practiceWords/types";
import EnglishLevelIcon from "./EnglishLevelIcon";
import AudioIcon from "../Icons/AudioIcon";

export default function WordInfoUI({
  wordInfo,
  handleDeleteWord,
  children,
}: {
  wordInfo: RawWordInfoInsert | WordInfo;
  handleDeleteWord: (word: WordInfo) => void;
  children?: React.ReactNode;
}) {
  const onDelete = async () => {
    if (children) {
      handleDeleteWord(wordInfo as WordInfo);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-200 rounded-md p-4 w-3/4">
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <h2 className="text-xl font-semibold">{wordInfo.word} </h2>
            <span className="italic text-sm">({wordInfo.part_of_speech})</span>
            <EnglishLevelIcon englishLevel={wordInfo.english_level} />
          </div>
          <div className="flex flex-row gap-2">
            <p>{wordInfo.transcription}</p>
            <AudioIcon audioUrl={wordInfo.word_audio} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {children}
          {children && (
            <button
              type="button"
              className="bg-red-500 rounded-md p-2 text-white font-semibold"
              onClick={onDelete}
            >
              Delete
            </button>
          )}
        </div>
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
        <div className="flex flex-col gap-2">
          {wordInfo.examples.map((example) => {
            return (
              <div className="flex flex-row gap-2" key={example.example}>
                <AudioIcon audioUrl={example.audio} />
                <p>
                  {example.example} - {example.translation}
                </p>
              </div>
            );
          })}
        </div>
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
