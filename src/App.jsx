import React, { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setUploadResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an MP3 file first.");
      return;
    }

    const formData = new FormData();
    formData.append("audioFile", file);

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      setUploadResult(result);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError(`Error uploading file: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">MP3 Upload</h1>

      <div className="flex flex-col gap-5 mb-6">
        <label className="block">
          <span className="sr-only">Choose MP3 file</span>
          <input
            type="file"
            accept="audio/mp3,audio/mpeg"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`py-3 px-5 rounded-md text-white font-medium ${
            !file || isUploading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload MP3"}
        </button>
      </div>

      {file && (
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="mb-1">
            Selected file: <span className="font-medium">{file.name}</span>
          </p>
          <p>
            Size:{" "}
            <span className="font-medium">
              {(file.size / 1024).toFixed(2)} KB
            </span>
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {uploadResult && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          <p className="font-medium mb-2">File uploaded successfully!</p>
          <p className="text-sm">
            Server response: {JSON.stringify(uploadResult)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
