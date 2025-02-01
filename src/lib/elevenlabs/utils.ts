import axios from "axios";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const generateSpeech = async (text: string): Promise<string> => {
  const voice_id = "JBFqnCBsd6RMkjVDRZzb";
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        text,
        model_id: "eleven_flash_v2_5", // Default model
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // To handle the audio file response
      }
    );

    const base64String = arrayBufferToBase64(response.data);
    return base64String;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error generating speech:", error.message);
    } else {
      console.error("Error generating speech:", error);
    }
    throw error;
  }
};
