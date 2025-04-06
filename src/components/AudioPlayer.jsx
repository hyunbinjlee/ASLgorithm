import React, { useRef, useState, useEffect } from "react";

const AudioPlayer = ({ audioUrl, fileType }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set up event listeners
    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    // Event listeners
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    // Cleanup function
    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, [audioRef]);

  // Handle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Format time
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle timeline change
  const handleTimelineChange = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg mt-2">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center space-x-2">
        <button
          onClick={togglePlay}
          className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white"
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <div className="text-xs text-gray-500 w-10">
          {formatTime(currentTime)}
        </div>

        <input
          type="range"
          className="w-full h-1 bg-gray-300 rounded-full"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleTimelineChange}
          style={{
            background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${
              (currentTime / duration) * 100
            }%, #d1d5db ${(currentTime / duration) * 100}%, #d1d5db 100%)`,
          }}
        />

        <div className="text-xs text-gray-500 w-10 text-right">
          {formatTime(duration)}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
