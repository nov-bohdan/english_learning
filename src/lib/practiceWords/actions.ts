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
import {
  RawWordInfoInsert,
  RawWordInfoRow,
  ServerActionResponse,
  Task,
} from "./types";
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
  const wordAudioPromise = generateAudio(
    word.word.toLowerCase().replace("to ", "")
  );
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
): Promise<ServerActionResponse<RawWordInfoRow[]>> {
  const word = formData.get("word")?.toString();
  if (!word) {
    return {
      success: false,
      error: "Word is empty",
    };
  }
  let alreadySavedWords = await dbWords.getWord({ word: word });
  if (alreadySavedWords) {
    alreadySavedWords = await Promise.all(
      alreadySavedWords.map(async (word) => {
        const isAssigned = await dbWords.getUserWordProgress(word.id, 1);
        if (isAssigned) {
          return { ...word, isAlreadySaved: true };
        } else {
          return { ...word, isAlreadySaved: false };
        }
      })
    );
    return { success: true, data: alreadySavedWords };
  }

  const wordInfos = await openAIGetWordInfo(word, "russian", "A2");
  const newWords: RawWordInfoInsert[] = [];
  const savedWords: RawWordInfoRow[] = [];
  for (const wordInfo of wordInfos) {
    const wordRow = await dbWords.getWord({
      word: wordInfo.word,
      partOfSpeech: wordInfo.part_of_speech,
    });

    const dateString = DateTime.now().toISO();
    const wordInfoWithAudio = await fillWordWithAudios(wordInfo);
    checkAudiosInWord(wordInfoWithAudio);
    const { popularity, ...rest } = wordInfoWithAudio;
    const formattedWordInfo: RawWordInfoInsert = {
      ...rest,
      created_at: dateString,
      isAlreadySaved: !!wordRow,
    };
    newWords.push(formattedWordInfo);
    if (!wordRow) {
      const newWord = await dbWords.saveWord(formattedWordInfo);
      savedWords.push(newWord);
    }
  }
  return { success: true, data: savedWords };
}

export async function saveWords(
  wordsInfo: RawWordInfoInsert[],
  prevData?: unknown,
  formData?: FormData
) {
  const savedWords: RawWordInfoRow[] = [];
  for (const word of wordsInfo) {
    const savedWord = await dbWords.saveWord(word);
    savedWords.push(savedWord);
  }

  return savedWords as RawWordInfoRow[];
}

export async function assignWordToUser(
  wordId: number | undefined,
  prevData: unknown,
  formData: FormData
) {
  if (!wordId) {
    throw new Error("Trying to assign a word without wordId");
  }
  await dbWords.assignWordToUser(wordId, 1);
  const savedWord = await dbWords.getWord({ id: wordId });
  if (!savedWord) {
    throw new Error("Unknown error in assigning word to a user");
  }
  return savedWord as RawWordInfoRow[];
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
  word: RawWordInfoRow,
  task: Task,
  prevData: unknown,
  formData: FormData
): Promise<ServerActionResponse<{ grade: number }>> {
  const answer = formData.get("answer")?.toString();
  if (!word || !answer || !task) {
    return { success: false, error: "Invalid word, task or answer" };
  }

  const result = await gradeEnRuTranslation(
    word.word,
    word.part_of_speech,
    answer
  );
  await updateScore(task.id, result.grade, task.score);
  await updateNextReviewDate(task.progress_id);
  return { success: true, data: result };
}

export async function checkRuEnTranslation(
  word: RawWordInfoRow,
  task: Task,
  prevData: unknown,
  formData: FormData
): Promise<ServerActionResponse<{ grade: number }>> {
  const answer = formData.get("answer")?.toString();
  if (!word || !answer || !task) {
    return { success: false, error: "Invalid word, task or answer" };
  }

  const result = await gradeRuEnTranslation(
    word.word,
    word.part_of_speech,
    answer
  );
  await updateScore(task.id, result.grade, task.score);
  await updateNextReviewDate(task.progress_id);
  return { success: true, data: result };
}

export async function checkMakeSentence(
  word: RawWordInfoRow,
  task: Task,
  taskDescription: string,
  prevData: unknown,
  formData: FormData
): Promise<ServerActionResponse<{ grade: number }>> {
  const answer = formData.get("answer")?.toString();
  if (!word || !answer || !task) {
    return { success: false, error: "Invalid word, task or answer" };
  }
  const result = await gradeMakeSentence(
    word.word,
    word.part_of_speech,
    answer,
    taskDescription
  );
  await updateScore(task.id, result.grade, task.score);
  await updateNextReviewDate(task.progress_id);
  return { success: true, data: result };
}

export async function checkDefinitionToEn(
  word: RawWordInfoRow,
  task: Task,
  prevData: unknown,
  formData: FormData
): Promise<ServerActionResponse<{ grade: number }>> {
  const answer = formData.get("answer")?.toString();
  if (!word || !answer || !task) {
    return { success: false, error: "Invalid word, task or answer" };
  }
  const result = await gradeRuEnTranslation(
    word.definition.definition,
    word.part_of_speech,
    answer
  );
  await updateScore(task.id, result.grade, task.score);
  await updateNextReviewDate(task.progress_id);
  return { success: true, data: result };
}

export async function checkAudioToWord(
  word: RawWordInfoRow,
  task: Task,
  prevData: unknown,
  formData: FormData
): Promise<ServerActionResponse<{ grade: number }>> {
  const answer = formData.get("answer")?.toString();
  if (!word || !answer || !task) {
    return { success: false, error: "Invalid word, task or answer" };
  }
  const result = {
    grade: 0,
  };
  if (
    answer.toLowerCase().replace("to ", "") ===
    word.word.toLowerCase().replace("to ", "")
  ) {
    result.grade = 100;
  } else {
    result.grade = 0;
  }

  await updateScore(task.id, result.grade, task.score);
  await updateNextReviewDate(task.progress_id);
  return { success: true, data: result };
}
