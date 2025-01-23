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

export const openAIGetWordInfo = async (
  word: string,
  nativeLanguage: string,
  userLevel: string
) => {
  const WordInfoFormat = z.object({
    response: z.array(
      z.object({
        word: z.string(),
        translation: z.string(),
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
        when_to_use: z.array(
          z.object({ scenario: z.string(), translation: z.string() })
        ),
      })
    ),
  });

  const prompt = `You are an AI English tutor that is created to enahce user learning experience. You will be provided with a word that user wants to learn. Your goal is to return an information about the word. The information includes following:
   - Translation to ${nativeLanguage}, definition of the word;
   - 3 examples of using the word (Everyday sentences with the word);
   - 3 popular synonyms of the word (Synonyms are the words with the same meaning. Never use related words. Only with the same meaning);
   - Up to 3 the most popular collocations of the word (For example if a word is 'decision' - you can add 'make a decision'). 
   - Up to 3 scenarios when you can use this word (In which situations). For example, for the word 'Apparently' you can return 'When expressing something that seems true based on visible evidence'
   - Word should be Capitalized (First letter is big).
   - Popularity parameter measures popularity of the given part of speech. For example, if the word is used both as verb and as noun, you can return 70% for verb and 30% for noun. Total must be 100%.
   - If the word is used in more than one part of speech, add all usages in the response. Even if other parts of speech used much more less, you should return them anyway, to give the user all available information.
   User English level is ${userLevel}, so your definition and examples should be fit for this level.
  The requested word is: [${word}]`;

  console.log(prompt);

  const response = await openai.beta.chat.completions.parse({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: zodResponseFormat(WordInfoFormat, "wordInfo"),
  });
  console.log("Got response");

  if (!response.choices[0].message.parsed?.response) {
    throw new Error("AI Get WordInfo Error");
  }

  const parsedResponse = response.choices[0].message.parsed.response;
  console.log(parsedResponse);
  return parsedResponse;
};
