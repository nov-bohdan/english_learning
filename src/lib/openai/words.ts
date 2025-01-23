import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { openai } from "./openaiClient";
import { z } from "zod";
import { WordInfo } from "../practiceWords/types";
import { DateTime } from "luxon";

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

export const openAIGetWordInfo = async (
  word: string,
  nativeLanguage: string,
  userLevel: string
): Promise<WordInfo[]> => {
  const WordInfoFormat = z.object({
    response: z.array(
      z.object({
        word: z.enum([word]),
        translation: z.string(),
        definition: z.object({
          definition: z.string(),
          translation: z.string(),
        }),
        part_of_speech: z.enum(PARTS_OF_SPEECH),
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

  const prompt = `You are an AI English tutor that is created to enahce user learning experience. You will be provided with a word that user wants to learn. Your goal is to return an information about the word. The information includes translation to ${nativeLanguage}, definition of the word, 3 examples of using the word (Everyday sentences with the word), 3 popular synonyms of the word (Synonyms are the words with the same meaning. Never use related words. Only with the same meaning), and up to 3 the most popular collocations of the word (For example if a word is 'decision' - you can add 'make a decision'). User English level is ${userLevel}, so your definition and examples should be fit for this level. If the word is used in more than one part of speech, add all usages in the response.
  The requested word is: [${word}]`;

  console.log(prompt);

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(WordInfoFormat, "wordInfo"),
  });

  if (!response.choices[0].message.parsed?.response) {
    throw new Error("AI Get WordInfo Error");
  }

  const parsedResponse = response.choices[0].message.parsed.response.map(
    (response) => ({ ...response, created_at: DateTime.now().toISO() })
  );
  return parsedResponse;
};
