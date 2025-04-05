import React, { useEffect, useState } from "react";

// Map of placeholder GIF URLs for different CS concepts
// In a real implementation, these would be actual ASL sign animations
const conceptGifs = {
  recursion:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNGEzMmJmOTI1MTlmOWRiOWZiNThmY2Y3Mzg5YmMzMTRiMDQ5MTM2MSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7TKF5DnsSLv4zVBu/giphy.gif",
  stack:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTlmYTUyMTM2Y2Q4ZTkyNWI3ZjJlOTk0YTgzMDhiNjA3NjNlYjdmNSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/l378cRKFl9Vbgx9cc/giphy.gif",
  "binary search":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmM1ZjUwZWRkMWU3Y2NhYjE3ODIzNTEzYjA5OTQwZWIwYTRiMmZiMCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/uurtMtTrYeuhO/giphy.gif",
  queue:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTcxNTVmMTQ3YTgzM2YzMDNiOWM5MGUzODFhM2M0ZGE0NWM1NmExYiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3oKIPnAiaMCws8nOsE/giphy.gif",
  "linked list":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmM3ODQ2ZWYwOGY0OWFmM2E0YmUwOGQ2ZGE5NTY3YzQ3NTE0NGEzNiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/QpVUMRUJGokfqXyfa1/giphy.gif",
  graph:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjA1MzNlYTJlNzcxZmI3NjE5MTdlM2NiOWVjZDUzYzQ4M2RlYWZmYSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3oKIPtjElfqwMOTbH2/giphy.gif",
  "depth first search":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTEzOWQyYTczN2NjMTRiY2YyYWVlYzNiYzFjNjZhYmRkYzQ3NGVkNCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/26uflDxU6cEhrhmjC/giphy.gif",
  "breadth first search":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzc1YWIwNGEwZGM2YTZiYjEzNTI3ZGVmMjZiYjUzNWI0ZjVhMDZhYiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/l0HlGRDhPTqVEvhCg/giphy.gif",
  "binary tree":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDU4MmI0YzkwOTc1NjJmMjE5MGE0MzI4NTExODFhYWExMDk3NGJkZCZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/l2R0eYcNq9rJUsVAA/giphy.gif",
  "hash table":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmM4MWZjODY1NTZlOTg5OWZmNjFkNTg3NTMwY2U5ZWQwYjY1NDI1YSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/YQitE4YNQNahy/giphy.gif",
};

// Default GIF for concepts without a specific one
const defaultGif =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmpsZGd1c3FyMzQ3cnNxdTZuNnMwc3ZrMDI5OWJscWF5YTN5ODduZyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/l46CyJmS9N5q8uQhO/giphy.gif";

const ASLConcept = ({ concept }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Get a GIF for this concept, or use default
  const gifUrl = conceptGifs[concept.term.toLowerCase()] || defaultGif;

  // Animation to ease in the component when it appears
  useEffect(() => {
    // Small delay before showing to allow for animation setup
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (e) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  return (
    <div
      className={`bg-gray-700 rounded-lg overflow-hidden shadow-lg transition-all duration-500 ease-out ${
        isVisible
          ? "opacity-100 transform-none"
          : "opacity-0 transform -translate-y-4"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 font-semibold">
            {concept.formattedTime}
          </span>
          <span className="text-blue-300 font-semibold">"{concept.term}"</span>
        </div>
        <button
          onClick={toggleFavorite}
          className="text-gray-400 hover:text-yellow-300 focus:outline-none"
          aria-label={
            isFavorited ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isFavorited ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 p-3">
        {/* ASL Sign Language Column */}
        <div className="bg-gray-800 rounded p-3">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
            ASL Sign Language
          </h3>
          <div className="text-gray-200">
            <p className="text-sm font-medium">{concept.term}</p>
            <p className="text-xs text-gray-400 mt-1">{concept.description}</p>
          </div>
        </div>

        {/* GIF Column */}
        <div className="bg-gray-800 rounded overflow-hidden">
          <div className="h-full w-full flex items-center justify-center">
            <img
              src={gifUrl}
              alt={`ASL sign for ${concept.term}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Timestamp Column */}
        <div className="bg-gray-800 rounded p-3">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 mb-2">
            Timestamp
          </h3>
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-200">
              {concept.formattedTime}
            </p>
            <button className="mt-2 text-xs text-blue-400 hover:text-blue-300">
              Jump to concept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASLConcept;
