"use client";

import { useEffect, useState } from "react";
import { WordInfo } from "@/lib/practiceWords/types";
import WordListItem from "./WordListItem";
import Practice from "./Practice";
import GetWordInfoPanel from "./GetWordInfoPanel";
import { DateTime } from "luxon";
import WordInfoUI from "./WordInfoUI";
import TopPanel from "./TopPanel";
import { useRouter } from "next/navigation";
import DiscoverNewWords from "./Discover/DiscoverNewWords";
import ReviewNewWords from "./Discover/ReviewNewWords";

const getWordsToPracticeNowCount = (words: WordInfo[]) => {
  let count = 0;
  for (const word of words) {
    const wordNextReviewDateMilis = DateTime.fromISO(
      word.next_review_date
    ).toMillis();
    const timeNowMillis = DateTime.now().toMillis();
    if (!wordNextReviewDateMilis || wordNextReviewDateMilis <= timeNowMillis)
      count++;
  }
  return count;
};

export default function PracticeWordsPage({
  words,
  wordsNumberPracticedToday,
  savedWordsNumberByDate,
  wordsToReview,
}: {
  words: WordInfo[];
  wordsNumberPracticedToday: number;
  savedWordsNumberByDate: { date: string; count: number }[];
  wordsToReview: WordInfo[];
}) {
  const router = useRouter();
  const [wordsState, setWordsState] = useState<WordInfo[]>(words);
  const [wordsToPracticeNowCount, setWordsToPracticeNowCount] =
    useState<number>(getWordsToPracticeNowCount(words));
  const [showWordDetails, setShowWordDetails] = useState<WordInfo | null>(null);
  const [currentMode, setCurrentMode] = useState<
    "practice" | "discover" | "review" | null
  >(null);

  useEffect(() => {
    setWordsToPracticeNowCount(getWordsToPracticeNowCount(wordsState));
  }, [wordsState, words]);

  useEffect(() => {
    setWordsState(words);
  }, [words]);

  const handleShowWordDetails = (word: WordInfo) => {
    const audio = new Audio(word.word_audio);
    audio.play();
    setShowWordDetails(word);
  };

  const handleDeleteWord = async (word: WordInfo) => {
    const result = await fetch("/delete_word", {
      method: "DELETE",
      body: JSON.stringify({ wordId: word.id }),
    });
    if (result) {
      setWordsState((oldWords) =>
        oldWords.filter((oldWord) => oldWord.id !== word.id)
      );
      setShowWordDetails(null);
    }
  };

  const handleFinishPractice = () => {
    router.refresh();
    setCurrentMode(null);
  };

  const setDiscoverMode = () => {
    setCurrentMode((oldMode) => (oldMode === "discover" ? null : "discover"));
  };
  const setReviewMode = () => {
    setCurrentMode((oldMode) => (oldMode === "review" ? null : "review"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-md">
      {/* TOP PANEL */}
      {currentMode !== "practice" && (
        <TopPanel
          words={wordsState}
          wordsToPracticeNowCount={wordsToPracticeNowCount}
          wordsNumberPracticedToday={wordsNumberPracticedToday}
          savedWordsNumberByDate={savedWordsNumberByDate}
          setDiscoverMode={setDiscoverMode}
          setReviewMode={setReviewMode}
          currentMode={currentMode}
          wordsToReviewCount={wordsToReview.length}
        />
      )}
      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {currentMode !== "practice" && (
          <>
            {/* LEFT PANEL: Saved Words */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex-1 max-h-screen overflow-y-auto transition-transform duration-300">
              <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  Saved Words
                </h2>
                <button
                  type="button"
                  onClick={() => setCurrentMode("practice")}
                  disabled={wordsToPracticeNowCount < 5}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {wordsToPracticeNowCount < 5
                    ? "Need 5 words to practice"
                    : "Start Practice"}
                </button>
              </div>
              {wordsState
                .sort((a, b) => b.avgProgress - a.avgProgress)
                .map((word) => (
                  <WordListItem
                    key={`${word.word}-${word.part_of_speech}`}
                    word={word}
                    onShowDetails={() => handleShowWordDetails(word)}
                  />
                ))}
            </div>
            {/* RIGHT PANEL: Word Details / GetWordInfoPanel */}
            {currentMode === null && (
              <div className="flex-1">
                {showWordDetails ? (
                  <WordInfoUI
                    wordInfo={showWordDetails}
                    handleDeleteWord={handleDeleteWord}
                  >
                    <button
                      type="button"
                      className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors"
                      onClick={() => setShowWordDetails(null)}
                    >
                      Close
                    </button>
                  </WordInfoUI>
                ) : (
                  <GetWordInfoPanel setWordsListState={setWordsState} />
                )}
              </div>
            )}
          </>
        )}
        {currentMode === "practice" && (
          <div className="flex-1">
            <Practice onFinishPractice={handleFinishPractice} />
          </div>
        )}
        {currentMode === "discover" && (
          <div className="flex-1">
            <DiscoverNewWords />
          </div>
        )}
        {currentMode === "review" && (
          <div className="flex-1">
            <ReviewNewWords
              wordsToReview={wordsToReview}
              setWordsListState={setWordsState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
