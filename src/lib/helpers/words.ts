import { RawWordInfoRow, WordInfo } from "../practiceWords/types";

export const mapRawRowToWords = (
  rawWordsInfo: RawWordInfoRow[]
): WordInfo[] => {
  return rawWordsInfo.map((rawWordInfo) => {
    if (!rawWordInfo.id || !rawWordInfo.created_at) {
      console.error(rawWordInfo);
      throw new Error("Invalid RawWordInfo");
    }
    return {
      id: rawWordInfo.id,
      word: rawWordInfo.word,
      translation: rawWordInfo.translation,
      transcription: rawWordInfo.transcription,
      english_level: rawWordInfo.english_level,
      definition: rawWordInfo.definition,
      part_of_speech: rawWordInfo.part_of_speech,
      examples: rawWordInfo.examples,
      synonyms: rawWordInfo.synonyms,
      collocations: rawWordInfo.collocations,
      created_at: rawWordInfo.created_at,
      // when_to_use: rawWordInfo.when_to_use,
      progress: rawWordInfo.progress || 0,
      next_review_date: rawWordInfo.next_review_date || "",
      word_audio: rawWordInfo.word_audio,
    };
  });
};
