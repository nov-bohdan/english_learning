import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { openai } from "./openaiClient";
import { z } from "zod";

const PARTS_OF_SPEECH = [
  "noun",
  "pronoun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "interjection",
] as const;

const ENGLISH_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const WordInfoFormat = z.object({
  response: z.array(
    z.object({
      word: z.string(),
      translation: z.string(),
      transcription: z.string(),
      english_level: z.enum(ENGLISH_LEVELS),
      definition: z.object({
        definition: z.string(),
        translation: z.string(),
      }),
      part_of_speech: z.enum(PARTS_OF_SPEECH),
      popularity: z.number(),
      examples: z.array(
        z.object({ example: z.string(), translation: z.string() })
      ),
      synonyms: z.array(z.string()),
      collocations: z.array(
        z.object({ collocation: z.string(), translation: z.string() })
      ),
    })
  ),
});

export type WordInfoFormatType = z.infer<
  typeof WordInfoFormat
>["response"][number];

export const openAIGetWordInfo = async (
  word: string,
  nativeLanguage: string,
  userLevel: string
) => {
  const prompt = `You are an AI English tutor that is created to enhance user learning experience. You will be provided with a word that user wants to learn. Your goal is to return an information about the word. The information includes following:
   - Translation to ${nativeLanguage}. Make sure the translation is in the right form. For example if the word "obfuscate" is in adjective form, the translation should be "Запутанный", not "Запутать".
   - Definition of the word. Try to make it as short as possible. In a way that is easy for user to understand, not academic or scientific format. Use the most popular word's meaning, if there are more than one;
   - Transcription in IPA format;
   - 3 examples of using the word (Everyday sentences with the word). They should match the definition that you provided for the word. Try to make them as diverse as possible to show the using of a word in different contexts;
   - 3 popular synonyms of the word (Synonyms are the words with the same meaning. Never use related words. Only with the same meaning);
   - Up to 3 the most popular collocations of the word (For example if a word is 'decision' - you can add 'make a decision').
   - english_level parameter means what English Level does the word matches. For example if the word is primarily used by users with level of B2 or more, then you should return B2 here.
   - Word should be Capitalized (First letter is big). If the word is verb, the word should start with "To";
   - Popularity parameter measures popularity of the given part of speech. For example, if the word is used both as verb and as noun, you can return 70% for verb and 30% for noun. Total must be 100%.
   - If the word is used in more than one part of speech, add all of them in the response. Even if other parts of speech used much more less, you should return them anyway, to give the user all available information.
   User English level is ${userLevel}, so your definition and examples should be fit for this level.
   Combinations word + part of speech should be unique. Return only the most popular sense for each combination. Additional meanings put in additional_meanings array. For example you should return run (verb) only once.
  The requested word is: [${word}]`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(WordInfoFormat, "wordInfo"),
  });

  if (!response.choices[0].message.parsed?.response) {
    throw new Error("AI Get WordInfo Error");
  }

  // console.log(JSON.stringify(response));

  const parsedResponse = response.choices[0].message.parsed.response;
  return parsedResponse.filter((response) => response.popularity > 10);
};

const TranslationGradeFormat = z.object({
  grade: z.number(),
});

export const gradeEnRuTranslation = async (
  word: string,
  partOfSpeech: string,
  answer: string
) => {
  const prompt = `You are an AI English tutor that is created to enhance user learning experience. User is studying new words and their current task is to translate an English word to his native language OR write a definition of the word (on any language). You will be evaluating his answer. You should return a grade on a 100-point scale. 
  Requested word is: [${word} (${partOfSpeech})].
  User's answer is: [${answer}]`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(TranslationGradeFormat, "gradeFormat"),
  });

  if (!response.choices[0].message.parsed) {
    throw new Error("AI gradeUserTranslation Error");
  }

  const parsedResponse = response.choices[0].message.parsed;
  return parsedResponse;
};

export const gradeRuEnTranslation = async (
  word: string,
  partOfSpeech: string,
  answer: string
) => {
  const prompt = `You are an AI English tutor that is created to enhance user learning experience. User is studying new words and their current task is to translate a Russian word to English. You will be evaluating his answer. You should return a grade on a 100-point scale. 
  Requested word is: [${word} (${partOfSpeech})].
  User's answer is: [${answer}]
  User's answer MUST be on English. If it's in other language, it is incorrect`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(TranslationGradeFormat, "gradeFormat"),
  });

  if (!response.choices[0].message.parsed) {
    throw new Error("AI gradeUserTranslation Error");
  }

  const parsedResponse = response.choices[0].message.parsed;
  return parsedResponse;
};

export const gradeDefinitionToEn = async (
  definition: string,
  partOfSpeech: string,
  answer: string
) => {
  const prompt = `You are an AI English tutor that is created to enhance user learning experience. User is studying new words and their current task is to write an English word that matches the given definition. You will be evaluating his answer. You should return a grade on a 100-point scale. 
  Requested definition is: [${definition} (${partOfSpeech})].
  User's answer is: [${answer}]
  User's answer MUST be on English. If it's in other language, it is incorrect`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(TranslationGradeFormat, "gradeFormat"),
  });

  if (!response.choices[0].message.parsed) {
    throw new Error("AI gradeDefinitionToEn Error");
  }

  const parsedResponse = response.choices[0].message.parsed;
  return parsedResponse;
};

const MakeSentenceGradeFormat = z.object({
  grade: z.number(),
  mistakes: z.array(
    z.object({
      mistake: z.string(),
      translation: z.string(),
    })
  ),
  correct_sentence: z.string(),
});

export const gradeMakeSentence = async (
  word: string,
  partOfSpeech: string,
  answer: string,
  taskDescription: string
) => {
  const prompt = `You are an AI English tutor that is created to enhance user learning experience. User is studying new words and their current task is the following: [${taskDescription}]. You will be evaluating his answer. You should return a grade on a 100-point scale. User's English level is A2, so fit your answer to their level. You also should return a list of user's mistakes. Translation is a translation of a mistake to Russian.
  Requested word is: [${word} (${partOfSpeech})].
  User's answer is: [${answer}]
  User's answer MUST be on English. If it's in other language, it is incorrect`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(
      MakeSentenceGradeFormat,
      "makeSentenceGradeFormat"
    ),
  });

  if (!response.choices[0].message.parsed) {
    throw new Error("AI gradeUserTranslation Error");
  }

  const parsedResponse = response.choices[0].message.parsed;
  return parsedResponse;
};
