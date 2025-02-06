import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { openai } from "./openaiClient";
import { z } from "zod";
import allwords from "./allwords.json";

const ENGLISH_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

function findCefrLevel(
  word: string
): "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null {
  const matchingWords = allwords.filter(
    (dataItem: { word: string; level: string }) =>
      dataItem.word.toLowerCase() === word.toLowerCase()
  );
  if (matchingWords) {
    const lowestLevel = matchingWords.sort()[matchingWords.length - 1];
    return lowestLevel.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  } else {
    return null;
  }
}

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
  const prompt = `You are an AI English tutor. Your task is to return detailed information about a given word, tailored for a user with English level ${userLevel}. Follow these instructions precisely:

1. **Translation:** Provide the translation of the word to ${nativeLanguage}. Ensure that the translation reflects the correct grammatical form. For example, if the word "obfuscate" is used as an adjective, the translation should be in adjective form (e.g., "Запутанный"), not the verb form.

2. **Definition:** Offer a short, clear definition that explains the most popular meaning of the word. The definition must be easy to understand (avoid academic or technical language) and appropriate for an beginner-intermediate learner. Also, include the translation of the definition.

3. **Transcription:** Provide the IPA transcription of the word.

4. **Examples:** Supply exactly 3 everyday example sentences that use the word, each accompanied by its translation. Ensure these examples illustrate the definition you provided.

5. **Synonyms:** List exactly 3 precise synonyms (words with the same meaning). Do not include loosely related words.

6. **Collocations:** Provide up to 3 of the most popular collocations for the word (e.g., for "decision", include "make a decision"). Each collocation should include both the collocation phrase and its translation.

7. **English Level:** Specify for which learner's CEFR level this word is. For example, words like "accused" is for C1 level, while "furniture" is for A2. Do not underestimate words.

8. **Word Formatting:**  
   - The word must be Capitalized (first letter uppercase).  
   - If the word is a verb, it must begin with "To". If "To" is not already present, prepend it.

9. **Popularity:**  
   - For words that have multiple parts of speech, return separate objects for each unique combination of word and part of speech.  
   - Each object must include a "popularity" number indicating the usage frequency.  
   - If the same word appears in multiple parts of speech, the sum of their popularity percentages must equal 100.

The word you need to process is: [${word}]`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(WordInfoFormat, "wordInfo"),
  });

  if (!response.choices[0].message.parsed?.response) {
    throw new Error("AI Get WordInfo Error");
  }

  let parsedResponse = response.choices[0].message.parsed.response;
  parsedResponse = parsedResponse.map((response) => {
    const cefrLevel = findCefrLevel(
      response.word.toLowerCase().replace("to ", "")
    );
    if (cefrLevel) {
      return {
        ...response,
        english_level: cefrLevel,
      };
    } else {
      return response;
    }
  });
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

const TranslationFormat = z.object({
  translation: z.string(),
});

export const translateWord = async (word: string) => {
  const prompt = `Translate word ${word} to Russian.`;

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(TranslationFormat, "TranslationFormat"),
  });

  if (!response.choices[0].message.parsed) {
    throw new Error("AI translateWord Error");
  }

  const parsedResponse = response.choices[0].message.parsed;
  return parsedResponse.translation;
};
