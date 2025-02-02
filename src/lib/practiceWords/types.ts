import { Database } from "../db/supabase";

export type EnglishLevelType = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type RawWordInfoInsert =
  Database["public"]["Tables"]["words"]["Insert"] & {
    isAlreadySaved?: boolean;
  };
export type RawWordInfoRow = Database["public"]["Tables"]["words"]["Row"] & {
  progress?: number;
  isAlreadySaved?: boolean;
  next_review_date?: string;
};

export type WordInfo = {
  id?: number;
  word: string;
  translation: string;
  transcription: string;
  english_level: EnglishLevelType;
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
  examples: { example: string; translation: string; audio: string }[];
  synonyms: string[];
  collocations: { collocation: string; translation: string }[];
  // when_to_use: { scenario: string; translation: string }[];
  created_at: string;
  progress: number;
  next_review_date: string;
  word_audio: string;
};

export type Task = {
  id: number;
  last_practiced: string | null;
  progress_id: number;
  score: number;
  task_type: string;
  word: RawWordInfoRow;
};

export type ServerActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
