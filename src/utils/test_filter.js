import { processTranscriptFile } from "./filter.js";

async function runTest() {
  try {
    const result = await processTranscriptFile("./transcript.txt");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTest();
