import { Database } from "../db/supabase";

export type RawWordInfo = Database["public"]["Tables"]["words"]["Insert"];

export type WordInfo = {
  word: string;
  translation: string;
  definition: { definition: string; translation: string };
  part_of_speech:
    | "noun"
    | "pronoun"
    | "verb"
    | "adjective"
    | "adverb"
    | "preposition"
    | "conjunction"
    | "interjection";
  examples: { example: string; translation: string }[];
  synonyms: string[];
  collocations: { collocation: string; translation: string }[];
};
