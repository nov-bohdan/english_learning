"use server";

import { DateTime } from "luxon";
import dbWords from "../db/words";
import {
  gradeRuEnTranslation,
  gradeEnRuTranslation,
  openAIGetWordInfo,
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

export async function checkEnRuTranslation(
  taskProgressId: number,
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

  const result = await gradeEnRuTranslation(word, partOfSpeech, answer);
  if (isAnswerCorrect(result.grade)) {
    const newScore = (score += 20);
    await dbWords.updateUserTaskProgress(taskProgressId, newScore);
  } else {
    const newScore = score - 20 >= 0 ? score - 20 : 0;
    await dbWords.updateUserTaskProgress(taskProgressId, newScore);
  }
  return result;
}

export async function checkRuEnTranslation(
  taskProgressId: number,
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

  const result = await gradeRuEnTranslation(word, partOfSpeech, answer);
  if (isAnswerCorrect(result.grade)) {
    const newScore = (score += 20);
    await dbWords.updateUserTaskProgress(taskProgressId, newScore);
  } else {
    const newScore = score - 20 >= 0 ? score - 20 : 0;
    await dbWords.updateUserTaskProgress(taskProgressId, newScore);
  }
  return result;
}
