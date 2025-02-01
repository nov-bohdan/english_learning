export const TASK_TYPES = [
  "EN_RU",
  "RU_EN",
  "MAKE_SENTENCE",
  "DEFINITION_TO_EN",
  "AUDIO_TO_WORD",
] as const;

export const TASK_TYPES_MAP: Record<(typeof TASK_TYPES)[number], string> = {
  EN_RU: "English to Russian",
  RU_EN: "Russian to English",
  MAKE_SENTENCE: "Make sentence",
  DEFINITION_TO_EN: "Definition to English",
  AUDIO_TO_WORD: "Audio to word",
};
