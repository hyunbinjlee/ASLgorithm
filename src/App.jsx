import React, { useRef, useState } from "react";
import ConceptsDisplay from "./components/ConceptsDisplay";
import ControlPanel from "./components/ControlPanel";
import LiveTranscription from "./components/LiveTranscription";
import { identifyKeyCSConcepts } from "./utils/filter";
import { processConcepts } from "./utils/atlas";

function App() {
  const conceptsDisplayRef = useRef(null);
  const [inputMode, setInputMode] = useState("upload"); // "upload" or "live"

  // Common states
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  // Handle adding a new concept from the control panel
  const handleNewConcept = (newConcept) => {
    console.log('hit handle new concept!')
    if (conceptsDisplayRef.current) {
      console.log('adding new concept: ' + newConcept)
      // Convert format from ControlPanel to ConceptsDisplay expected format
      const formattedConcept = {
        ...newConcept,
        term: newConcept.term,
        formattedTime:
          newConcept.formattedTime || formatTime(newConcept.timestamp || 0),
        importance: Math.floor(Math.random() * 4) + 6, // Random importance between 6-9
        definition:
          newConcept.description ||
          newConcept.definition ||
          "No definition available",
      };

  // Process concepts through the pipeline and send to ConceptsDisplay
  const processAndAddConcept = async (transcript) => {
    if (!transcript) return;

    try {
      setIsGenerating(true);

      // Extract concepts using Gemini
      const concepts = await identifyKeyCSConcepts(transcript);

      // Match with Atlas dictionary
      const formattedConcepts = await processConcepts(concepts);

      // Add concepts to display
      formattedConcepts.forEach((concept) => {
        if (conceptsDisplayRef.current) {
          conceptsDisplayRef.current.addConcept(concept);
        }
      });
    } catch (error) {
      console.error("Error processing concepts:", error);
      setError(`Error processing concepts: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle new concepts from live transcription
  const handleLiveTranscription = (concepts) => {
    // If concepts is an array, process each concept
    if (Array.isArray(concepts)) {
      concepts.forEach((concept) => {
        if (conceptsDisplayRef.current) {
          conceptsDisplayRef.current.addConcept(concept);
        }
      });
    }
    // If it's a single concept object
    else if (concepts && typeof concepts === "object") {
      if (conceptsDisplayRef.current) {
        conceptsDisplayRef.current.addConcept(concepts);
      }
    }
  };

  // Handle new concepts from file upload
  const handleNewConcept = (newConcept) => {
    if (conceptsDisplayRef.current) {
      conceptsDisplayRef.current.addConcept(newConcept);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-gray-900">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-teal-800">ASLgorithm</h1>
            <span className="ml-4 text-teal-600 text-sm">
              CS Lecture Analysis
            </span>
          </div>

          {/* Toggle between upload and live modes */}
          <div className="bg-gray-100 rounded-full p-1 flex items-center">
            <button
              onClick={() => setInputMode("upload")}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                inputMode === "upload"
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Upload Audio
            </button>
            <button
              onClick={() => setInputMode("live")}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                inputMode === "live"
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Live Transcription
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search concepts..."
            className="w-full py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Concepts Display */}
        <ConceptsDisplay ref={conceptsDisplayRef} />

        {/* Input Section - Toggle between upload and live */}
        {inputMode === "upload" ? (
          <ControlPanel
            file={file}
            setFile={setFile}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            error={error}
            setError={setError}
            audioUrl={audioUrl}
            setAudioUrl={setAudioUrl}
            onNewConcept={handleNewConcept}
          />
        ) : (
          <LiveTranscription onNewConcepts={handleLiveTranscription} />
        )}
      </main>
    </div>
  );
}

export default App;
