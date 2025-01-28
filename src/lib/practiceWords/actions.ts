"use server";

import { DateTime } from "luxon";
import dbWords from "../db/words";
import {
  gradeRuEnTranslation,
  gradeEnRuTranslation,
  openAIGetWordInfo,
  gradeMakeSentence,
} from "../openai/words";
import { RawWordInfoInsert, RawWordInfoRow } from "./types";

function isAnswerCorrect(grade: number) {
  if (grade >= 80) {
    return true;
  }
  if (grade < 80) {
    return false;
  }
}

export async function getWordInfo(
  prevData: unknown,
  formData: FormData
): Promise<RawWordInfoRow[]> {
  const word = formData.get("word")?.toString();
  if (!word) {
    throw new Error("Word is empty");
  }
  const wordInfos = await openAIGetWordInfo(word, "russian", "A2");
  const savedWords: RawWordInfoRow[] = [];
  for (const wordInfo of wordInfos) {
    const dateString = DateTime.now().toISO();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { popularity, ...rest } = wordInfo;
    const formattedWordInfo: RawWordInfoInsert = {
      ...rest,
      created_at: dateString,
    };
    const savedWord = await dbWords.saveWord(formattedWordInfo);
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

  return newScore;
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

async function updateNextReviewDate(wordProgressId: number, score: number) {
  let newReviewDate = null;
  if (score < 16) {
    newReviewDate = DateTime.now().plus({ minutes: 1 });
  } else if (score < 40) {
    newReviewDate = DateTime.now().plus({ hours: 1 });
  } else if (score < 60) {
    newReviewDate = DateTime.now().plus({ hours: 3 });
  } else if (score < 80) {
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
  const newScore = await updateScore(taskProgressId, result.grade, score);
  await updateNextReviewDate(wordProgressId, newScore);
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
  const newScore = await updateScore(taskProgressId, result.grade, score);
  await updateNextReviewDate(wordProgressId, newScore);
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
  const newScore = await updateScore(taskProgressId, result.grade, score);
  await updateNextReviewDate(wordProgressId, newScore);
  return result;
}
