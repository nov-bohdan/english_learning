import * as deepl from "deepl-node";

export async function translate(text: string): Promise<string> {
  const client = new deepl.Translator(process.env.DEEPL_API_KEY!);

  const translation = await client.translateText(text, "en", "ru", {
    // modelType: "quality_optimized",
  });
  return translation.text;
}
