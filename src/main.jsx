import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { identifyKeyCSConcepts } from "./utils/filter.js";
import { hardcodedTranscript } from "./utils/transcript.js";
import { processConcepts, testAtlasMapping } from "./utils/atlas.js"; // Import from atlas.js

// Test both pipeline steps
async function testFullPipeline() {
  console.log("Starting full pipeline test...");

  try {
    // Step 3: Get concepts from transcript using Gemini
    console.log("Step 3: Identifying key CS concepts...");
    const concepts = await identifyKeyCSConcepts(hardcodedTranscript);
    console.log("Identified CS concepts:");
    console.log(JSON.stringify(concepts, null, 2));

    // Step 4: Map concepts to Atlas dictionary
    console.log("Step 4: Mapping concepts to Atlas...");
    const mappedConcepts = await processConcepts(concepts);
    console.log("Concepts mapped to Atlas:");
    console.log(JSON.stringify(mappedConcepts, null, 2));

    return mappedConcepts; // Return for potential use in the UI
  } catch (error) {
    console.error("Pipeline test failed:", error);
  }
}

// Test just the Atlas mapping with sample data
async function testAtlasOnly() {
  console.log("Testing Atlas mapping with sample data...");

  try {
    const mappedConcepts = await testAtlasMapping();
    console.log("Atlas mapping test results:");
    console.log(JSON.stringify(mappedConcepts, null, 2));

    return mappedConcepts;
  } catch (error) {
    console.error("Atlas mapping test failed:", error);
  }
}

// Expose test functions to the window for console testing
window.testFullPipeline = testFullPipeline;
window.testAtlasOnly = testAtlasOnly;

// If you want to run tests automatically on page load, uncomment one of these:
// testFullPipeline();
testAtlasOnly();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
