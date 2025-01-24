import { RawUserSettings } from "../helpers/types";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      activities: {
        Row: {
          date: string;
          duration: number;
          id: number;
          type_id: number;
          user_duration: number;
        };
        Insert: {
          date: string;
          duration: number;
          id?: number;
          type_id: number;
          user_duration: number;
        };
        Update: {
          date?: string;
          duration?: number;
          id?: number;
          type_id?: number;
          user_duration?: number;
        };
        Relationships: [
          {
            foreignKeyName: "activities_type_id_fkey";
            columns: ["type_id"];
            isOneToOne: false;
            referencedRelation: "activity_types";
            referencedColumns: ["id"];
          }
        ];
      };
      activity_types: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          id: number;
          settings: RawUserSettings["settings"];
          user_id: number;
        };
        Insert: {
          id?: number;
          settings: RawUserSettings["settings"];
          user_id: number;
        };
        Update: {
          id?: number;
          settings?: RawUserSettings["settings"];
          user_id?: number;
        };
        Relationships: [];
      };
      words: {
        Row: {
          collocations: { collocation: string; translation: string }[];
          definition: { definition: string; translation: string };
          examples: { example: string; translation: string }[];
          id: number;
          part_of_speech:
            | "noun"
            | "pronoun"
            | "verb"
            | "adjective"
            | "adverb"
            | "preposition"
            | "conjunction"
            | "interjection";
          synonyms: string[];
          translation: string;
          word: string;
          when_to_use: { scenario: string; translation: string }[];
          created_at: string;
        };
        Insert: {
          collocations: { collocation: string; translation: string }[];
          definition: { definition: string; translation: string };
          examples: { example: string; translation: string }[];
          id?: number;
          part_of_speech:
            | "noun"
            | "pronoun"
            | "verb"
            | "adjective"
            | "adverb"
            | "preposition"
            | "conjunction"
            | "interjection";
          synonyms: string[];
          translation: string;
          when_to_use: { scenario: string; translation: string }[];
          word: string;
          created_at?: string;
        };
        Update: {
          collocations?: { collocation: string; translation: string }[];
          definition?: { definition: string; translation: string };
          examples?: { example: string; translation: string }[];
          id?: number;
          part_of_speech?:
            | "noun"
            | "pronoun"
            | "verb"
            | "adjective"
            | "adverb"
            | "preposition"
            | "conjunction"
            | "interjection";
          synonyms?: string[];
          translation?: string;
          when_to_use?: { scenario: string; translation: string }[];
          word?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_task_progress: {
        Row: {
          id: number;
          last_practiced: string;
          progress_id: number;
          score: number;
          task_type: string;
        };
        Insert: {
          id?: number;
          last_practiced?: string;
          progress_id: number;
          score: number;
          task_type: string;
        };
        Update: {
          id?: number;
          last_practiced?: string;
          progress_id?: number;
          score?: number;
          task_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_task_progress_progress_id_fkey";
            columns: ["progress_id"];
            isOneToOne: false;
            referencedRelation: "user_word_progress";
            referencedColumns: ["id"];
          }
        ];
      };
      user_word_progress: {
        Row: {
          id: number;
          next_review_date: string;
          user_id: number;
          word_id: number;
        };
        Insert: {
          id?: number;
          next_review_date?: string;
          user_id: number;
          word_id: number;
        };
        Update: {
          id?: number;
          next_review_date?: string;
          user_id?: number;
          word_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "user_word_progress_word_id_fkey";
            columns: ["word_id"];
            isOneToOne: false;
            referencedRelation: "words";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
