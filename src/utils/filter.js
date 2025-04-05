import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Identifies key CS concepts from a lecture transcript using Gemini API
 */
async function identifyKeyCSConcepts(transcript) {
  try {
    const prompt = `
    I have a computer science lecture transcript. Please identify the key CS concepts mentioned 
    in the transcript, focusing on data structures, algorithms, and programming concepts.

    For each concept:
    1. Identify the exact phrase as it appears in the text (e.g., "binary tree" rather than separate "binary" and "tree")
    2. Provide a brief definition
    3. Note the approximate timestamp (if available in the transcript)
    4. Group related terms or synonyms used in the transcript
    5. Rate the importance of this concept in the transcript on a scale of 1-10

    Return the results as a structured JSON object with the format:
    {
      "concept_name": {
        "definition": "brief definition",
        "timestamp": "mm:ss or best approximation",
        "related_terms": ["synonym1", "synonym2"],
        "importance": number
      },
      ...
    }

    Here is the transcript:
    ${transcript}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch =
      text.match(/```json\n([\s\S]*?)\n```/) ||
      text.match(/```\n([\s\S]*?)\n```/) ||
      text.match(/{[\s\S]*?}/);

    if (jsonMatch) {
      const jsonString = jsonMatch[0].replace(/```json\n|```\n|```/g, "");
      return JSON.parse(jsonString);
    } else {
      console.warn(
        "Could not parse JSON from response. Using text response instead."
      );
      return { error: "Could not parse structured data", rawResponse: text };
    }
  } catch (error) {
    console.error("Error identifying CS concepts:", error);
    throw error;
  }
}

export { identifyKeyCSConcepts };
