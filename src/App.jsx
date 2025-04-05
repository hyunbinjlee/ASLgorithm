import React, { useState } from "react";
import UploadPanel from "./components/UploadPanel";
import ASLFeed from "./components/ASLFeed";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recognizedConcepts, setRecognizedConcepts] = useState([
    // Include one example concept so we can see it works
    {
      id: "example-concept",
      term: "recursion",
      timestamp: 34.5,
      formattedTime: "0:34",
      description:
        "A method where the solution to a problem depends on solutions to smaller instances of the same problem.",
    },
  ]);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  // Function to handle new concept detection
  const handleNewConcept = (concept) => {
    setRecognizedConcepts((prev) => [concept, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-4 font-sans">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel - Upload and Controls */}
          <div className="md:col-span-1 space-y-6">
            <UploadPanel
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

          {/* Right Panel - ASL Feed */}
          <div className="md:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[600px] flex flex-col">
              <div className="bg-gray-900 p-3 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-blue-300">
                  Live ASL Concept Feed
                  {isGenerating && (
                    <span className="ml-2 relative inline-flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  )}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {recognizedConcepts.length > 0 ? (
                  <ASLFeed concepts={recognizedConcepts} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    {isProcessing ? (
                      <p>Analyzing lecture content...</p>
                    ) : (
                      <p>
                        No CS concepts detected yet. Upload and analyze a
                        lecture to begin.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default App;
