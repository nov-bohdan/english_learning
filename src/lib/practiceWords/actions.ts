"use server";

import { DateTime } from "luxon";
import dbWords from "../db/words";
import { openAIGetWordInfo } from "../openai/words";
import { RawWordInfoInsert, RawWordInfoRow } from "./types";

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
      confident_score: 0.0,
      last_repetitions: { date: dateString, count: 0 },
      created_at: dateString,
    };
    const savedWord = await dbWords.saveWord(formattedWordInfo);
    savedWords.push(savedWord);
  }
  return savedWords as RawWordInfoRow[];
}
