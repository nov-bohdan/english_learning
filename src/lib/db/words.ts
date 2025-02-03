import { DateTime } from "luxon";
import { RawWordInfoInsert, RawWordInfoRow } from "../practiceWords/types";
import { dbClient } from "./dbClient";
import { TASK_TYPES } from "../practiceWords/tasks/TaskTypes";

const client = dbClient.client;

const getWord = async ({
  id,
  word,
  partOfSpeech,
}: {
  id?: number;
  word?: string;
  partOfSpeech?:
    | "noun"
    | "pronoun"
    | "verb"
    | "adjective"
    | "adverb"
    | "preposition"
    | "conjunction"
    | "interjection";
}): Promise<RawWordInfoRow[] | null> => {
  let query = client.from("words").select();
  if (id) {
    query = query.eq("id", id);
  }
  if (word) {
    query = query.ilikeAnyOf("word", [
      word,
      `to ${word}`,
      word.toLowerCase().replace("to ", ""),
    ]);
  }
  if (partOfSpeech) {
    query = query.eq("part_of_speech", partOfSpeech);
  }
  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  if (data === null || data.length === 0) {
    return null;
  }
  return data;
};

const saveWord = async (word: RawWordInfoInsert): Promise<RawWordInfoRow> => {
  let savedWord: RawWordInfoRow | RawWordInfoRow[] | null = await getWord({
    word: word.word,
    partOfSpeech: word.part_of_speech,
  });
  if (!savedWord) {
    delete word.isAlreadySaved;
    const { data, error } = await client.from("words").insert(word).select();
    if (error) {
      throw new Error(error.message);
    }
    savedWord = data;
  }
  if (!savedWord) {
    throw new Error("Unknown error in saving word");
  }
  savedWord = savedWord[0];

  return savedWord;
};

const assignWordToUser = async (wordId: number, userId: string) => {
  const userWordProgress = await getUserWordProgress(wordId, userId);
  if (!userWordProgress) {
    await addNewUserWordProgress(wordId, userId);
  }
};

const unassignWordToUser = async (wordId: number, userId: string) => {
  const { error } = await client
    .from("user_word_progress")
    .delete()
    .eq("user_id", userId)
    .eq("word_id", wordId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

const getUserWordProgressForPractice = async (userId: string, date: string) => {
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

  return data;
};

const getUserWordProgress = async (wordId: number, userId: string) => {
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

const addNewUserWordProgress = async (wordId: number, userId: string) => {
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

const calculateAvgProgress = (
  userTaskProgress: {
    task_type: string;
    score: number;
  }[]
) => {
  return Math.floor(
    userTaskProgress.reduce((sum, item) => sum + item.score, 0) /
      userTaskProgress.length
  );
};

type TaskType = (typeof TASK_TYPES)[number];

const isValidTaskType = (value: string): value is TaskType => {
  return (TASK_TYPES as readonly string[]).includes(value);
};

const mapProgress = (
  userTaskProgress: { task_type: string; score: number }[]
): Record<TaskType, number> => {
  const taskMap = {} as Record<TaskType, number>;
  userTaskProgress.forEach(({ task_type, score }) => {
    if (isValidTaskType(task_type)) {
      taskMap[task_type] = score;
    }
  });
  return taskMap;
};

const getWords = async (userId: string): Promise<RawWordInfoRow[]> => {
  const { data, error } = await client
    .from("user_word_progress")
    .select(
      `words (*), user_task_progress!left(
        task_type,
        score
      ), next_review_date`
    )
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }

  const words = data.map((dataItem) => ({
    ...dataItem.words,
    progress: mapProgress(dataItem.user_task_progress),
    avgProgress: calculateAvgProgress(dataItem.user_task_progress),
    next_review_date: dataItem.next_review_date,
  }));

  return words as RawWordInfoRow[];
};

const getWordsToPractice = async (userId: string) => {
  const words = await getUserWordProgressForPractice(
    userId,
    DateTime.now().toISO()
  );
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

const getWordsNumberPracticedToday = async (userId: string) => {
  const { data, error } = await client
    .from("user_task_progress")
    .select(`progress_id, progress_id(*)`)
    .eq("progress_id.user_id", userId)
    .gte("last_practiced", DateTime.now().toFormat("yyyy-MM-dd"));

  if (error) {
    throw new Error(error.message);
  }

  const count = [...new Set(data.map((dataItem) => dataItem.progress_id.id))]
    .length;

  return count;
};

const getSavedWordsNumberByDate = async (
  userId: string
): Promise<{ date: string; count: number }[]> => {
  const { data, error } = await client
    .from("user_word_progress")
    .select(`created_at`)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const uniqueDates = new Set([
    ...data.map((dataItem) =>
      DateTime.fromISO(dataItem.created_at).toFormat("yyyy-MM-dd")
    ),
  ]);

  const countByDates: { date: string; count: number }[] = [];
  uniqueDates.forEach((date) => {
    countByDates.push({
      date: date,
      count: data.filter((dataItem) =>
        DateTime.fromISO(dataItem.created_at).hasSame(
          DateTime.fromFormat(date, "yyyy-MM-dd"),
          "day"
        )
      ).length,
    });
  });

  return countByDates;
};

const dbWords = {
  getWord,
  saveWord,
  getWords,
  getWordsToPractice,
  getWordTaskProgresses,
  createNewUserTaskProgress,
  updateUserTaskProgress,
  updateNextReviewDate,
  assignWordToUser,
  getUserWordProgress,
  getWordsNumberPracticedToday,
  getSavedWordsNumberByDate,
  unassignWordToUser,
};

export default dbWords;
