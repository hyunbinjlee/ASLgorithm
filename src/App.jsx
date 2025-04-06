import React, { useRef, useState } from "react";
import ConceptsDisplay from "./components/ConceptsDisplay";
import ControlPanel from "./components/ControlPanel";
import AudioPlayer from "./components/AudioPlayer";

function App() {
  // Create a ref for the ConceptsDisplay component
  const conceptsDisplayRef = useRef(null);

  // State for audio handling
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

      // Call the addConcept method
      conceptsDisplayRef.current.addConcept(formattedConcept);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // For the "Add Demo Concept" button in App.jsx
  const handleAddDemoConcept = () => {
    if (conceptsDisplayRef.current) {
      conceptsDisplayRef.current.addDemoConcept();
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-gray-900">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center">
          <h1 className="text-2xl font-bold text-teal-800">ASLgorithm</h1>
          <span className="ml-4 text-teal-600 text-sm">
            CS Lecture Analysis
          </span>
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

        {/* Concepts Display with ref */}
        <ConceptsDisplay ref={conceptsDisplayRef} />

        {/* Control Panel */}
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
      </main>
    </div>
  );
}

export default App;
