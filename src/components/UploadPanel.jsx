import React, { useRef } from "react";
import AudioPlayer from "./AudioPlayer";

const UploadPanel = ({
  file,
  setFile,
  isProcessing,
  setIsProcessing,
  isGenerating,
  setIsGenerating,
  error,
  setError,
  audioUrl,
  setAudioUrl,
  onNewConcept,
}) => {
  const audioRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError(null);

    // Revoke previous audio URL to prevent memory leaks
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // Create a URL for the file that can be used to play the audio
    if (selectedFile && selectedFile.type.includes("audio")) {
      const url = URL.createObjectURL(selectedFile);
      setAudioUrl(url);
    } else {
      setAudioUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      setError("Please select an audio file first.");
      return;
    }

    if (!file.type.includes("audio")) {
      setError("Please select a valid audio file.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsProcessing(false);

      // Start simulating real-time concept detection
      setIsGenerating(true);
      simulateConceptDetection();
    } catch (err) {
      console.error("Error processing file:", err);
      setError(`Error processing file: ${err.message}`);
      setIsProcessing(false);
    }
  };

  // Simulate detecting concepts in real-time from the audio
  const simulateConceptDetection = () => {
    // Sample CS concepts to be "detected" over time
    const conceptsToDetect = [
      {
        term: "stack",
        timestamp: 8,
        description:
          "A linear data structure that follows Last In First Out (LIFO) principle.",
      },
      {
        term: "binary search",
        timestamp: 15,
        description:
          "A search algorithm that finds the position of a target value within a sorted array.",
      },
      {
        term: "queue",
        timestamp: 22,
        description:
          "A linear data structure that follows First In First Out (FIFO) principle.",
      },
      {
        term: "linked list",
        timestamp: 30,
        description:
          "A linear data structure where elements are not stored at contiguous locations.",
      },
    ];

    // Set a timer for each concept based on its timestamp
    conceptsToDetect.forEach((concept, index) => {
      setTimeout(() => {
        // Only add if we're still in generating mode
        if (isGenerating) {
          const newConcept = {
            ...concept,
            id: Date.now() + index, // Ensure a unique ID
            formattedTime: formatTime(concept.timestamp),
          };
          onNewConcept(newConcept);
        }
      }, concept.timestamp * 1000); // Convert seconds to milliseconds
    });

    // Stop generating after the last concept
    const lastTimestamp =
      conceptsToDetect[conceptsToDetect.length - 1].timestamp;
    setTimeout(() => {
      setIsGenerating(false);
    }, (lastTimestamp + 2) * 1000);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-teal-800">Lecture Upload</h2>
        <span className="text-sm text-teal-600">
          {file ? "Change" : "Select file"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow p-1">
          <div
            className="h-32 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')",
            }}
          ></div>
          <div className="p-3">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mb-2 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-teal-800">Upload File</h3>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="text-sm text-teal-600 hover:text-teal-800 transition-colors">
                  Select Lecture
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow p-1">
          <div
            className="h-32 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60')",
            }}
          ></div>
          <div className="p-3">
            <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center mb-2 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-teal-800">Process Audio</h3>
              <button
                onClick={handleProcess}
                disabled={!file || isProcessing || isGenerating}
                className={`text-sm ${
                  !file || isProcessing || isGenerating
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-orange-500 hover:text-orange-700 transition-colors"
                }`}
              >
                {isProcessing
                  ? "Processing..."
                  : isGenerating
                  ? "Analyzing..."
                  : "Start Analysis"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {file && (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-teal-800">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {audioUrl && (
              <AudioPlayer audioUrl={audioUrl} fileType={file?.type} />
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default UploadPanel;
