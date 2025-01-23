import { RawWordInfo } from "../practiceWords/types";
import { dbClient } from "./dbClient";

const client = dbClient.client;

const saveWord = async (word: RawWordInfo): Promise<RawWordInfo> => {
  const { data, error } = await client.from("words").insert(word).select();
  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

const getWords = async (): Promise<RawWordInfo[]> => {
  const { data, error } = await client.from("words").select();
  if (error) {
    throw new Error(error.message);
  }

  return data as RawWordInfo[];
};

const dbWords = { saveWord, getWords };

export default dbWords;
