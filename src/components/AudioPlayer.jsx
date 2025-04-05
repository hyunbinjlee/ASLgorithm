import React, { useRef } from "react";

const AudioPlayer = ({ audioUrl, fileType }) => {
  const audioRef = useRef(null);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-5">
      <h2 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
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
        Audio Playback
      </h2>
      <div className="bg-gray-50 rounded-lg p-4">
        <audio ref={audioRef} controls className="w-full">
          <source src={audioUrl} type={fileType} />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default AudioPlayer;
