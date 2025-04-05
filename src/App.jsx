import React, { useState, useEffect, useRef } from "react";
import ASLFeed from "./components/ASLFeed";
import Header from "./components/Header";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recognizedConcepts, setRecognizedConcepts] = useState([
    // Include one example concept so we can see it works
    {
      id: "example-concept",
      term: "recursion",
      timestamp: 34,
      formattedTime: "0:34",
      description:
        "A method where the solution to a problem depends on solutions to smaller instances of the same problem.",
    },
  ]);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const feedRef = useRef(null);

  // Function to handle new concept detection
  const handleNewConcept = (concept) => {
    setRecognizedConcepts((prev) => [concept, ...prev]);
  };

  // Auto-scroll to the top when new concepts are added
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [recognizedConcepts.length]);

  return (
    <div className="min-h-screen bg-stone-100 text-teal-900">
      <div className="max-w-3xl mx-auto px-4 py-4 font-sans">
        <Header />

        {/* CS Concepts Feed - Main focus */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-teal-800">
              Concepts
              {isGenerating && (
                <span className="ml-2 relative inline-flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              )}
            </h2>
            <span className="text-teal-600">View all &gt;</span>
          </div>

          <div
            ref={feedRef}
            className="h-[500px] overflow-y-auto rounded-lg bg-white shadow-sm border border-gray-200 p-4"
          >
            {recognizedConcepts.length > 0 ? (
              <ASLFeed concepts={recognizedConcepts} />
            ) : (
              <div className="h-full flex items-center justify-center text-teal-400">
                {isProcessing ? (
                  <p>Analyzing lecture content...</p>
                ) : (
                  <p>
                    No CS concepts detected yet. Upload and analyze a lecture to
                    begin.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Control Panel at bottom */}
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
      </div>
    </div>
  );
}

export default App;
