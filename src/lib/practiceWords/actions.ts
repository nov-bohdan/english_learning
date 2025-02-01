/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { DateTime } from "luxon";
import dbWords from "../db/words";
import {
  gradeRuEnTranslation,
  gradeEnRuTranslation,
  openAIGetWordInfo,
  gradeMakeSentence,
  WordInfoFormatType,
} from "../openai/words";
import { RawWordInfoInsert, RawWordInfoRow } from "./types";
import { generateAudio } from "../elevenlabs/audio";

function isAnswerCorrect(grade: number) {
  if (grade >= 80) {
    return true;
  }
  if (grade < 80) {
    return false;
  }
}

type WordInfoFormatWithAudioType = Omit<WordInfoFormatType, "examples"> & {
  word_audio?: string;
  examples: {
    example: string;
    translation: string;
    audio?: string;
  }[];
};

type WordInfoFormatWithAudioComplete = Omit<WordInfoFormatType, "examples"> & {
  word_audio: string;
  examples: {
    example: string;
    translation: string;
    audio: string;
  }[];
};

async function fillWordWithAudios(
  word: WordInfoFormatWithAudioType
): Promise<WordInfoFormatWithAudioComplete> {
  const wordAudioPromise = generateAudio(word.word);
  const examplesAudioPromises = word.examples.map((example) => {
    const audioPromise = generateAudio(example.example);
    return audioPromise;
  });
  const [wordAudio, ...examplesAudio] = await Promise.all([
    wordAudioPromise,
    ...examplesAudioPromises,
  ]);

  return {
    ...word,
    word_audio: wordAudio,
    examples: word.examples.map((example, index) => {
      return { ...example, audio: examplesAudio[index] };
    }),
  };
}

function checkAudiosInWord(word: WordInfoFormatWithAudioType) {
  word.examples.forEach((example) => {
    if (!example.audio) {
      throw new Error("Audio generation error");
    }
  });
}

export async function getWordInfo(
  prevData: unknown,
  formData: FormData
): Promise<RawWordInfoInsert[]> {
  const word = formData.get("word")?.toString();
  if (!word) {
    throw new Error("Word is empty");
  }
  const wordInfos = await openAIGetWordInfo(word, "russian", "A2");
  const savedWords: RawWordInfoInsert[] = [];
  for (const wordInfo of wordInfos) {
    const wordRow = await dbWords.getWord(
      wordInfo.word,
      wordInfo.part_of_speech
    );

    const dateString = DateTime.now().toISO();
    const wordInfoWithAudio = await fillWordWithAudios(wordInfo);
    checkAudiosInWord(wordInfoWithAudio);
    const { popularity, ...rest } = wordInfoWithAudio;
    const formattedWordInfo: RawWordInfoInsert = {
      ...rest,
      created_at: dateString,
      isAlreadySaved: !!wordRow,
    };
    savedWords.push(formattedWordInfo);
  }
  return savedWords as RawWordInfoInsert[];
}

export async function saveWords(
  wordInfo: RawWordInfoInsert[],
  prevData: unknown,
  formData: FormData
) {
  const savedWords: RawWordInfoRow[] = [];
  for (const word of wordInfo) {
    const savedWord = await dbWords.saveWord(word);
    savedWords.push(savedWord);
  }

  return savedWords as RawWordInfoRow[];
}

function adjustScore(score: number, grade: number) {
  const maxGrade = 79; // The highest grade for incorrect answer
  const maxDeduction = 20; // Deduction when grade = 0
  const minDeduction = 3; // Deduction when grade = 79

  let newScore = null;
  if (isAnswerCorrect(grade)) {
    newScore = score + grade / 5;
  } else {
    // Calculate the adjustment factor based on grade
    const deduction =
      maxDeduction - (maxDeduction - minDeduction) * (grade / maxGrade);

    // Calculate the new score
    newScore = score - deduction;
  }

  if (newScore < 0) newScore = 0;

  return Math.ceil(newScore);
}

async function updateScore(
  taskProgressId: number,
  grade: number,
  score: number
) {
  const newScore = adjustScore(score, grade);
  await dbWords.updateUserTaskProgress(taskProgressId, newScore);
  return newScore;
}

async function updateNextReviewDate(wordProgressId: number) {
  const allTaskProgresses = await dbWords.getWordTaskProgresses(wordProgressId);
  const lowestScore = Math.min(
    ...allTaskProgresses.map((taskP) => taskP.score)
  );
  let newReviewDate = null;
  if (lowestScore < 16) {
    newReviewDate = DateTime.now().plus({ minutes: 1 });
  } else if (lowestScore < 40) {
    newReviewDate = DateTime.now().plus({ hours: 1 });
  } else if (lowestScore < 60) {
    newReviewDate = DateTime.now().plus({ hours: 3 });
  } else if (lowestScore < 80) {
    newReviewDate = DateTime.now().plus({ hours: 12 });
  } else {
    newReviewDate = DateTime.now().plus({ days: 2 });
  }

  await dbWords.updateNextReviewDate(wordProgressId, newReviewDate.toISO());
}

export async function checkEnRuTranslation(
  taskProgressId: number,
  wordProgressId: number | null,
  score: number,
  prevData: unknown,
  formData: FormData
) {
  const word = formData.get("word")?.toString();
  const partOfSpeech = formData.get("part_of_speech")?.toString();
  const answer = formData.get("definition_or_translation")?.toString();
  if (!word || !partOfSpeech || !answer) {
    throw new Error("Invalid word or answer");
  }
  if (!wordProgressId) {
    throw new Error("invalid wordProgressId");
  }

  const result = await gradeEnRuTranslation(word, partOfSpeech, answer);
  await updateScore(taskProgressId, result.grade, score);
  await updateNextReviewDate(wordProgressId);
  return result;
}

export async function checkRuEnTranslation(
  taskProgressId: number,
  wordProgressId: number | null,
  score: number,
  prevData: unknown,
  formData: FormData
) {
  const word = formData.get("word")?.toString();
  const partOfSpeech = formData.get("part_of_speech")?.toString();
  const answer = formData.get("translation")?.toString();
  if (!word || !partOfSpeech || !answer) {
    throw new Error("Invalid word or answer");
  }
  if (!wordProgressId) {
    throw new Error("invalid wordProgressId");
  }
  const result = await gradeRuEnTranslation(word, partOfSpeech, answer);
  await updateScore(taskProgressId, result.grade, score);
  await updateNextReviewDate(wordProgressId);
  return result;
}

export async function checkMakeSentence(
  taskProgressId: number,
  wordProgressId: number | null,
  score: number,
  taskDescription: string,
  prevData: unknown,
  formData: FormData
) {
  const word = formData.get("word")?.toString();
  const partOfSpeech = formData.get("part_of_speech")?.toString();
  const answer = formData.get("sentence")?.toString();
  if (!word || !partOfSpeech || !answer) {
    throw new Error("Invalid word or answer");
  }
  if (!wordProgressId) {
    throw new Error("invalid wordProgressId");
  }
  const result = await gradeMakeSentence(
    word,
    partOfSpeech,
    answer,
    taskDescription
  );
  await updateScore(taskProgressId, result.grade, score);
  await updateNextReviewDate(wordProgressId);
  return result;
}

export async function checkDefinitionToEn(
  taskProgressId: number,
  wordProgressId: number | null,
  score: number,
  prevData: unknown,
  formData: FormData
) {
  const definition = formData.get("definition")?.toString();
  const partOfSpeech = formData.get("part_of_speech")?.toString();
  const answer = formData.get("answer")?.toString();
  if (!definition || !partOfSpeech || !answer) {
    throw new Error("Invalid definition or answer");
  }
  if (!wordProgressId) {
    throw new Error("invalid wordProgressId");
  }
  const result = await gradeRuEnTranslation(definition, partOfSpeech, answer);
  await updateScore(taskProgressId, result.grade, score);
  await updateNextReviewDate(wordProgressId);
  return result;
}
