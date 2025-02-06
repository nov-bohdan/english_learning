const fs = require("fs/promises");
const path = require("path");

async function removeEasyWords() {
  try {
    // Define file paths (adjust paths if needed)
    const jsonFilePath = path.join(__dirname, "allwords.json");
    const easyWordsFilePath = path.join(__dirname, "easy_words_to_remove.txt");
    const outputFilePath = path.join(__dirname, "filtered_words.json");

    // Read and parse the JSON file
    const jsonData = await fs.readFile(jsonFilePath, "utf8");
    const wordsArray = JSON.parse(jsonData);

    // Read the text file containing easy words to remove
    const easyWordsData = await fs.readFile(easyWordsFilePath, "utf8");
    // Split by newline, trim each line, and filter out any empty strings
    const easyWordsSet = new Set(
      easyWordsData
        .split(/\r?\n/)
        .map((word) => word.trim().toLowerCase())
        .filter((word) => word.length > 0)
    );

    // Filter out any entries in wordsArray that match a word in the easyWords set
    const filteredWords = wordsArray.filter(
      (item) => !easyWordsSet.has(item.word.toLowerCase())
    );

    // Write the filtered array to a new JSON file with pretty formatting (indentation)
    await fs.writeFile(
      outputFilePath,
      JSON.stringify(filteredWords, null, 2),
      "utf8"
    );

    console.log(`Filtered JSON saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error processing files:", error);
  }
}

// Run the function
removeEasyWords();
