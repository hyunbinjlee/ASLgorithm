import React, { useRef } from "react";
import AudioPlayer from "./AudioPlayer";
import { identifyKeyCSConcepts } from "../utils/filter.js";

// Demo concepts to showcase the real-time animation
const demoConcepts = [
  {
    term: "binary tree",
    timestamp: 42,
    description:
      "A tree data structure in which each node has at most two children, referred to as the left child and the right child.",
  },
  {
    term: "graph",
    timestamp: 55,
    description:
      "A non-linear data structure consisting of vertices/nodes and edges that connect pairs of vertices.",
  },
  {
    term: "sorting",
    timestamp: 67,
    description:
      "Algorithms to arrange data in a certain order, typically ascending or descending.",
  },
];

const ControlPanel = ({
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
    console.log('my selected file is: ' + selectedFile.name)
    // console.log('my selected file path is: ' + selectedFile.path)

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

  const handleProcess = async (event) => {

    if (event) event.preventDefault();

    if (!file && !isGenerating) {
      // For demo purposes, we'll proceed even without a file
      console.log("Running demo mode without file");
    }

    console.log('handling this file: ' + file.name)

    // add file to form data to push
    const formData = new FormData();
    formData.append('file', file);
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate processing time
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // push the file using formdata with POST to express serer
      const response  = await fetch('/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('issue with uploading file, response not ok')
      }

      else {
        if (response.status != 200) {
          console.log('other issue with file upload')
          setIsProcessing(false);
        }

        else {
          console.log('successful upload')
          // alert('successful upload')

          const sentTranscript = await response.text();

          console.log(sentTranscript);
          
          
          //Start simulating real-time concept detection
          setIsGenerating(true);
          setIsProcessing(false);
          simulateConceptDetection();

          // trying to retrieve from gemini now
          const concepts = identifyKeyCSConcepts(sentTranscript);
          console.log('concepts from gemini filter:');
          console.log(concepts);
        }

      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError(`Error processing file: ${err.message}`);
      setIsProcessing(false);
    }
  };

  // Function to demonstrate a single new concept appearing
  const demoNewConcept = () => {
    const demoIndex = Math.floor(Math.random() * demoConcepts.length);
    const concept = demoConcepts[demoIndex];

    // Add random variation to timestamps to make it seem more realistic
    const timeVariation = Math.floor(Math.random() * 10);
    const timestamp = concept.timestamp + timeVariation;

    const newConcept = {
      ...concept,
      id: Date.now(),
      formattedTime: formatTime(timestamp),
    };

    onNewConcept(newConcept);
  };

  // Simulate detecting concepts in real-time from the audio
  const simulateConceptDetection = () => {
    // Sample CS concepts to be "detected" over time
    console.log("client bug 1")
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
      }, concept.timestamp * 200); // Speed up for demo (200ms instead of 1000ms)
    });

    console.log("client bug 2")
    // Stop generating after the last concept
    const lastTimestamp =
      conceptsToDetect[conceptsToDetect.length - 1].timestamp;
    setTimeout(() => {
      setIsGenerating(false);
    }, (lastTimestamp + 2) * 200);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-teal-800">Lecture Upload</h2>
        <span className="text-sm text-teal-600">
          {file ? file.name : "Select a file to begin"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* File details if a file is selected */}
        {file && (
          <div className="flex-grow">
            <p className="text-sm text-gray-500">
              File size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            {audioUrl && (
              <AudioPlayer audioUrl={audioUrl} fileType={file?.type} />
            )}
          </div>
        )}

        {/* Upload button */}
        <div>
          <label className="btn-secondary flex items-center justify-center cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            Upload File
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Process button */}
        <div>
          <button
            onClick={handleProcess}
            disabled={isProcessing || isGenerating}
            className={`btn-primary flex items-center justify-center ${
              isProcessing || isGenerating
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
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
                Analyzing...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
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
                Process Audio
              </>
            )}
          </button>
        </div>

        {/* Demo button */}
        <div>
          <button
            onClick={demoNewConcept}
            disabled={isProcessing}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            </svg>
            Add Demo Concept
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
