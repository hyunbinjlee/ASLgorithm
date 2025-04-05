import React, { useRef } from "react";

const AudioPlayer = ({ audioUrl, fileType }) => {
  const audioRef = useRef(null);

  return (
    <div className="mt-2">
      <audio ref={audioRef} controls className="h-8 w-full max-w-xs">
        <source src={audioUrl} type={fileType} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
