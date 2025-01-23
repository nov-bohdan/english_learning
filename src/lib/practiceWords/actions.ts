"use server";

import dbWords from "../db/words";
import { openAIGetWordInfo } from "../openai/words";
import { RawWordInfoRow, WordInfo } from "./types";

export async function getWordInfo(
  prevData: unknown,
  formData: FormData
): Promise<RawWordInfoRow[]> {
  const word = formData.get("word")?.toString();
  if (!word) {
    throw new Error("Word is empty");
  }
  const wordInfos: WordInfo[] = await openAIGetWordInfo(word, "russian", "A2");
  const savedWords: RawWordInfoRow[] = [];
  for (const wordInfo of wordInfos) {
    const savedWord = await dbWords.saveWord(wordInfo);
    savedWords.push(savedWord);
  }
  return savedWords as RawWordInfoRow[];
}
