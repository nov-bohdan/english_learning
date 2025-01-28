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

const calculateAvgProgress = (
  userTaskProgress: {
    score: number;
  }[]
) => {
  return Math.floor(
    userTaskProgress.reduce((sum, item) => sum + item.score, 0) /
      userTaskProgress.length
  );
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

const getUserWordProgressForPractice = async (userId: number, date: string) => {
  const { data, error } = await client
    .from("user_word_progress")
    .select(`*, words (*)`)
    .eq("user_id", userId)
    .lt("next_review_date", date);

  if (error) {
    throw new Error(error.message);
  }

  if (data.length === 0) {
    return null;
  }

  // const words = data.map((dataItem) => dataItem.words);

  return data;
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
    .select(
      `words (*), user_task_progress!inner(
        score
      ), next_review_date`
    )
    .eq("user_id", 1);
  if (error) {
    throw new Error(error.message);
  }

  const words = data.map((dataItem) => ({
    ...dataItem.words,
    progress: calculateAvgProgress(dataItem.user_task_progress),
    next_review_date: dataItem.next_review_date,
  }));

  return words as RawWordInfoRow[];
};

const getWordsToPractice = async () => {
  const words = await getUserWordProgressForPractice(1, DateTime.now().toISO());
  return words || [];
};

const getWordTaskProgresses = async (progressId: number) => {
  const { data, error } = await client
    .from("user_task_progress")
    .select()
    .eq("progress_id", progressId);
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const createNewUserTaskProgress = async (
  progressId: number,
  taskType: string
) => {
  const { data, error } = await client
    .from("user_task_progress")
    .insert({
      progress_id: progressId,
      task_type: taskType,
      score: 0,
      last_practiced: null,
    })
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

const updateUserTaskProgress = async (
  taskProgressId: number,
  score: number
) => {
  const { data, error } = await client
    .from("user_task_progress")
    .update({ score: score, last_practiced: DateTime.now().toISO() })
    .eq("id", taskProgressId)
    .select();
  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

const updateNextReviewDate = async (
  wordProgressId: number,
  reviewDate: string
) => {
  const { data, error } = await client
    .from("user_word_progress")
    .update({
      next_review_date: reviewDate,
    })
    .eq("id", wordProgressId)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
};

const dbWords = {
  saveWord,
  getWords,
  getWordsToPractice,
  getWordTaskProgresses,
  createNewUserTaskProgress,
  updateUserTaskProgress,
  updateNextReviewDate,
};

export default dbWords;
