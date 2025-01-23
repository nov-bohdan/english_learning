import dbWords from "@/lib/db/words";
import { mapRawRowToWords } from "@/lib/helpers/words";

export async function GET(request: Request): Promise<Response> {
  const words = await dbWords.getWordsToPractice();
  const mappedWords = mapRawRowToWords(words);
  return Response.json(mappedWords);
}
