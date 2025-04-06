import React, { useRef } from "react";
import AudioPlayer from "./AudioPlayer";
import { identifyKeyCSConcepts } from "../utils/filter.js";
import { processConcepts } from "../utils/atlas.js";

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
    console.log('my selected file is: ' + selectedFile)
    // console.log('my selected file path is: ' + selectedFile.path)

    setFile(selectedFile);
    setError(null);

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

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

          // trying to retrieve from gemini now
          const concepts = await identifyKeyCSConcepts(sentTranscript);
          console.log('concepts from gemini filter:');
          console.log(concepts);

          const mappedConcepts = await processConcepts(concepts);
          console.log('mapped concepts looking at atlas data')
          console.log(JSON.stringify(mappedConcepts, null, 2));
          setIsGenerating(false);
          
          // this should populate new concepts into the concepts display component from parrent app
          mappedConcepts.forEach((concept) => {onNewConcept(concept)});
        }

      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError(`Error processing file: ${err.message}`);
      setIsProcessing(false);
      setIsGenerating(false);
    }
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

        <div className="flex flex-wrap gap-3">
          {/* Upload button */}
          <div>
            <label className="flex items-center justify-center py-2 px-4 bg-white border border-teal-600 rounded-md text-teal-600 hover:bg-teal-50 cursor-pointer">
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
              disabled={isProcessing || isGenerating || !file}
              className={`flex items-center justify-center py-2 px-4 bg-teal-600 rounded-md text-white hover:bg-teal-700 ${
                isProcessing || isGenerating || !file
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
