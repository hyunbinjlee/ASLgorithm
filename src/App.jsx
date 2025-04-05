import React, { useState, useRef } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState(null);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setProcessResult(null);
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

      // For a hackathon demo, pretend we're doing speech recognition
      // In a real implementation, you would use a speech recognition API here

      // Example result data
      setProcessResult({
        success: true,
        message: "Audio processed successfully",
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          duration: audioRef.current?.duration?.toFixed(2) || 1110.02,
          lastModified: new Date(file.lastModified).toLocaleString(),
        },
        recognizedText:
          "Example recognized text from the audio file. In a real implementation, this would contain the actual transcription.",
        // You could add ASL related data here for your CodeSign project
        aslSigns: [
          {
            term: "graph",
            timestamp: 0.5,
            description:
              "A non-linear data structure consisting of vertices/nodes and edges.",
          },
          {
            term: "breadth first search",
            timestamp: 3.2,
            description:
              "An algorithm that explores all neighbors at the present depth before moving to nodes at the next level.",
          },
          {
            term: "depth first search",
            timestamp: 6.8,
            description:
              "An algorithm that explores as far as possible along each branch before backtracking.",
          },
          {
            term: "queue",
            timestamp: 15.2,
            description:
              "A linear data structure that follows First In First Out (FIFO) principle.",
          },
          {
            term: "stack",
            timestamp: 24.6,
            description:
              "A linear data structure that follows Last In First Out (LIFO) principle.",
          },
        ],
      });
    } catch (err) {
      console.error("Error processing file:", err);
      setError(`Error processing file: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto p-6 font-sans">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
            ASLgorithm
          </h1>
          <p className="text-lg text-blue-700 mb-4">
            Transform speech into ASL visualizations for CS concepts
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upload audio lecture file
          </h2>

          <div className="space-y-6">
            <label className="block">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer bg-blue-50">
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
                    className="h-12 w-12 mx-auto text-blue-500 mb-2"
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
                  <p className="text-blue-700 font-medium">
                    Click to browse or drag & drop your audio file here
                  </p>
                  <p className="text-blue-400 text-sm mt-1">
                    MP3, WAV, and other audio formats accepted
                  </p>
                </div>
              </div>
            </label>

            <div className="flex justify-center">
              <button
                onClick={handleProcess}
                disabled={!file || isProcessing}
                className={`py-3 px-8 rounded-md text-white font-medium ${
                  !file || isProcessing
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  </span>
                ) : (
                  "Process Audio"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-blue-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              File Information
            </h2>
            <div className="pl-7">
              <p className="mb-1">
                <span className="text-gray-500">Name:</span>{" "}
                <span className="font-medium text-gray-900">{file.name}</span>
              </p>
              <p>
                <span className="text-gray-500">Size:</span>{" "}
                <span className="font-medium text-gray-900">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200 flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-red-500"
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

        {/* Audio Player */}
        {audioUrl && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728"
                />
              </svg>
              Audio Preview
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <audio ref={audioRef} controls className="w-full">
                <source src={audioUrl} type={file.type} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}

        {/* Processing Results */}
        {processResult && (
          <div className="space-y-8 mb-12">
            {/* Success Message */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800">
                    Audio processed successfully!
                  </h3>
                  <p className="text-green-700">
                    Duration:{" "}
                    <span className="font-medium">
                      {processResult.file.duration} seconds
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Recognized Text */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                Recognized Text
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                {processResult.recognizedText}
              </div>
            </div>

            {/* Detected CS Concepts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Detected CS Concepts
              </h2>

              <div className="space-y-6">
                {processResult.aslSigns.map((sign, index) => (
                  <div
                    key={index}
                    className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-1/4 bg-blue-600 flex items-center justify-center text-white p-4">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-wide mb-1">
                          ASL Sign
                        </div>
                        <div className="text-xl font-bold">{sign.term}</div>
                        <div className="text-xs mt-1">
                          Timestamp: {sign.timestamp}s
                        </div>
                      </div>
                    </div>
                    <div className="w-3/4 p-4 bg-white">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {sign.term.charAt(0).toUpperCase() + sign.term.slice(1)}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {sign.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-6">
          <p>ASLgorithm &copy; 2025</p>
        </div>
      </div>
    </div>
  );
}

export default App;
