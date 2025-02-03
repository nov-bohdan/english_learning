"use server";

import { uploadFile } from "../storage/storage";
import { generateSpeech } from "./utils";

export const generateAudio = async (text: string) => {
  const base64String = await generateSpeech(text);
  const randomName = `audio-${crypto.randomUUID()}.mp3`;

  const path = await uploadFile(base64String, randomName);
  const fullPath = `${process.env.STORAGE_URL}${path}`;
  return fullPath;
};
