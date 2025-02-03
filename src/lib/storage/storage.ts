import { decode } from "base64-arraybuffer";
import { dbClient } from "../db/dbClient";

const client = dbClient.client;

export const uploadFile = async (base64FileData: string, fileName: string) => {
  const { data, error } = await client.storage
    .from("audio")
    .upload(fileName, decode(base64FileData), {
      contentType: "audio/mpeg",
    });

  if (error) {
    throw new Error(error.message);
  }

  return data.path;
};
