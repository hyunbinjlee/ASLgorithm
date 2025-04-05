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
    <>
      <div className="bg-gray-800 rounded-lg shadow-lg p-5">
        <h2 className="text-xl font-semibold text-blue-300 mb-4">
          Upload Lecture
        </h2>

        <div className="space-y-5">
          <label className="block">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
              />
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mx-auto text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-gray-300">Click to upload audio lecture</p>
                <p className="text-gray-500 text-sm mt-1">
                  MP3, WAV files accepted
                </p>
              </div>
            </div>
          </label>

          <button
            onClick={handleProcess}
            disabled={!file || isProcessing || isGenerating}
            className={`w-full py-3 px-5 rounded-md font-medium flex items-center justify-center ${
              !file || isProcessing || isGenerating
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : isGenerating ? (
              <>
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Live Analyzing...
              </>
            ) : (
              "Start Analysis"
            )}
          </button>
        </div>

        {file && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-300 text-sm">
              <span className="text-gray-500">File:</span> {file.name}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-500">Size:</span>{" "}
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      {audioUrl && <AudioPlayer audioUrl={audioUrl} fileType={file?.type} />}

      {error && (
        <div className="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-700 flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </>
  );
};

export default UploadPanel;
