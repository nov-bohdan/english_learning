import { Database } from "../db/supabase";

export type RawWordInfoInsert = Database["public"]["Tables"]["words"]["Insert"];
export type RawWordInfoRow = Database["public"]["Tables"]["words"]["Row"];

export type WordInfo = {
  id?: number;
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
  when_to_use: { scenario: string; translation: string }[];
  created_at: string;
};

export type Task = {
  id: number;
  last_practiced: string | null;
  progress_id: number;
  score: number;
  task_type: string;
  word: RawWordInfoRow;
};
