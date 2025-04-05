import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { identifyKeyCSConcepts } from "./utils/filter.js";
import { hardcodedTranscript } from "./utils/transcript.js";

async function testTranscriptProcessing() {
  console.log("Starting transcript processing...");

  try {
    const concepts = await identifyKeyCSConcepts(hardcodedTranscript);
    console.log("Identified CS concepts:");
    console.log(JSON.stringify(concepts, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test - this will execute when this file is loaded
testTranscriptProcessing();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
