import { DateTime } from "luxon";
import { RawWordInfoInsert, RawWordInfoRow } from "../practiceWords/types";
import { dbClient } from "./dbClient";

const client = dbClient.client;

const getWord = async (
  word: string,
  partOfSpeech:
    | "noun"
    | "pronoun"
    | "verb"
    | "adjective"
    | "adverb"
    | "preposition"
    | "conjunction"
    | "interjection"
): Promise<RawWordInfoRow | null> => {
  const { data, error } = await client
    .from("words")
    .select()
    .eq("word", word)
    .eq("part_of_speech", partOfSpeech);

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    return null;
  }
  return data[0];
};

const saveWord = async (word: RawWordInfoInsert): Promise<RawWordInfoRow> => {
  let savedWord = await getWord(word.word, word.part_of_speech);
  if (!savedWord) {
    const { data, error } = await client.from("words").insert(word).select();
    if (error) {
      throw new Error(error.message);
    }
    savedWord = data[0];
  }

  const userWordProgress = await getUserWordProgress(savedWord.id, 1);
  if (!userWordProgress) {
    await addNewUserWordProgress(savedWord.id, 1);
  }

  return savedWord;
};

const getUserWordProgress = async (wordId: number, userId: number) => {
  const { data, error } = await client
    .from("user_word_progress")
    .select()
    .eq("word_id", wordId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    return null;
  }
  return data[0];
};

const addNewUserWordProgress = async (wordId: number, userId: number) => {
  const { data, error } = await client
    .from("user_word_progress")
    .insert({
      word_id: wordId,
      user_id: userId,
      next_review_date: DateTime.now().toISO(),
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }
  return data[0];
};

const getWords = async (): Promise<RawWordInfoRow[]> => {
  const { data, error } = await client
    .from("user_word_progress")
    .select(`words (*)`)
    .eq("user_id", 1);
  if (error) {
    throw new Error(error.message);
  }

  const words = data.map((dataItem) => dataItem.words);

  return words as RawWordInfoRow[];
};

const getWordsToPractice = async (): Promise<RawWordInfoRow[]> => {
  return await getWords();
};

const dbWords = { saveWord, getWords, getWordsToPractice };

export default dbWords;
