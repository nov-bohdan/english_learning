import { RawWordInfoInsert, WordInfo } from "@/lib/practiceWords/types";
import EnglishLevelIcon from "./EnglishLevelIcon";
import AudioIcon from "../Icons/AudioIcon";

export default function WordInfoUI({
  wordInfo,
  handleDeleteWord,
  children,
}: {
  wordInfo: RawWordInfoInsert | WordInfo;
  handleDeleteWord?: (word: WordInfo) => void;
  children?: React.ReactNode;
}) {
  const onDelete = async () => {
    if (handleDeleteWord) {
      handleDeleteWord(wordInfo as WordInfo);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl p-6 shadow-md">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {wordInfo.word}
            </h2>
            <span className="italic text-sm text-gray-600">
              ({wordInfo.part_of_speech})
            </span>
            <EnglishLevelIcon englishLevel={wordInfo.english_level} />
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <p className="text-base">{wordInfo.transcription}</p>
            <AudioIcon audioUrl={wordInfo.word_audio} />
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-4 md:mt-0">
          {children}
          {handleDeleteWord && (
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-500 hover:bg-red-600 transition-colors duration-200 rounded-md px-4 py-2 text-white font-semibold"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <hr className="border-gray-300" />

      {/* Translation */}
      <p className="text-xl font-semibold text-gray-800">
        {wordInfo.translation}
      </p>

      {/* Definition */}
      <div className="mt-2 text-gray-700">
        <p className="mb-1 font-bold">Definition:</p>
        <p>{wordInfo.definition.definition}</p>
        <p className="mt-1">{wordInfo.definition.translation}</p>
      </div>

      {/* Examples */}
      <div className="mt-4 text-gray-700">
        <p className="font-bold mb-1">Examples:</p>
        <div className="flex flex-col gap-2">
          {wordInfo.examples.map((example) => (
            <div className="flex items-center gap-3" key={example.example}>
              <AudioIcon audioUrl={example.audio} />
              <p>
                {example.example} -{" "}
                <span className="italic">{example.translation}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Synonyms */}
      <div className="mt-4 text-gray-700">
        <p className="font-bold">Synonyms:</p>
        <p>{wordInfo.synonyms.join(", ")}</p>
      </div>

      {/* Collocations */}
      <div className="mt-4 text-gray-700">
        <p className="font-bold">Collocations:</p>
        <div className="flex flex-col gap-1">
          {wordInfo.collocations.map((collocation) => (
            <p key={collocation.collocation}>
              {collocation.collocation} -{" "}
              <span className="italic">{collocation.translation}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
