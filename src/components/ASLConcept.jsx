import React, { useState } from "react";

// Map of more professional CS-related GIFs for different concepts
const conceptGifs = {
  recursion:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHd0YTU0N2dxamFncjc5dWlvdGc3Mng3ZXcxbDlvYmdqZXF1MXlucSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/XH9VpICwYyQ2HpLkVm/giphy.gif", // Recursion visualization
  stack:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3V5ZnIxNjNib2xrcWZ3MGhxanFsdnI2cjVna2xiam1mOTlhd2RraSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/yWcVKlGUu1CDAhHqTT/giphy.gif", // Stack operation visualization
  "binary search":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnoyMml1M25xYzNwZTdpemxkcDhpZ2lpazJrcXh4dG8xc3h0OHNrayZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/26gR2qGRnxxXAvbIA/giphy.gif", // Binary search visualization
  queue:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExamtieW51cXgzMnJwOGN6NDZtdm10emk0eXluNWptM3Vma2VibGk0ZiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/H7wajFPnZGdRWaQeu0/giphy.gif", // Queue operation visualization
  "linked list":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjR3aGY3YXQxYXlzejV5ajlwNmY3cHViZmdmcTgwdXQ4aGhnaXhlYyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/UtnxCnjWAOL1J6TNUR/giphy.gif", // Linked list visualization
  graph:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWt3MnVpOXdtYm1lazVxeXY0YjRhcm04OTZwbzRkamd1dmVpbjR5cSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/JmJMzLWYQ24QcHUQP3/giphy.gif", // Graph visualization
  tree: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjR4Z3hsczR6MXR0Z29tMWFnb3ZvZXF1N29jYW9va2E5MWZnY3VxcyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/l3vR4VfkD4D7SUTOM/giphy.gif", // Tree visualization
  sorting:
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHd0YTU0N2dxamFncjc5dWlvdGc3Mng3ZXcxbDlvYmdqZXF1MXlucSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/XH9VpICwYyQ2HpLkVm/giphy.gif", // Sorting algorithm visualization
  "binary tree":
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjR4Z3hsczR6MXR0Z29tMWFnb3ZvZXF1N29jYW9va2E5MWZnY3VxcyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/l3vR4VfkD4D7SUTOM/giphy.gif", // Binary tree visualization
};

// Default CS visualization GIF for concepts without a specific one
const defaultGif =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm13bXpldWNpcHNudTJ0M3dkZ3drenozeTZ0ZHEyc205MGE1eDMyZSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/26tn33aiTi1jkl6H6/giphy.gif"; // Generic code/algorithm visualization

// Predefined logo colors
const logoColors = [
  "bg-teal-600",
  "bg-teal-700",
  "bg-teal-500",
  "bg-teal-800",
  "bg-teal-500",
  "bg-teal-600",
];

const ASLConcept = ({ concept, index = 0, isNew = false }) => {
  // IMPORTANT: Always declare hooks at the top level, before any conditional returns
  const [isFavorited, setIsFavorited] = useState(false);

  // Fail quietly if data is missing but don't break the app
  if (!concept || !concept.term) {
    console.warn("ASLConcept received invalid concept data");
    return null;
  }

  // Get a color based on the concept term
  const getLogoColor = () => {
    const charCode = concept.term.charCodeAt(0);
    const colorIndex = charCode % logoColors.length;
    return logoColors[colorIndex];
  };

  // Calculate colors only after validation
  const logoColor = getLogoColor();

  // Calculate importance-based styles with fallbacks for missing data
  const importance = concept.importance || 5; // Default to middle importance if missing

  const importanceColor =
    importance >= 8
      ? "bg-red-50 border-red-200 text-red-800"
      : importance >= 5
      ? "bg-amber-50 border-amber-200 text-amber-800"
      : "bg-emerald-50 border-emerald-200 text-emerald-800";

  const importanceBarColor =
    importance >= 8
      ? "bg-red-500"
      : importance >= 5
      ? "bg-amber-500"
      : "bg-emerald-500";

  // Get a GIF for this concept, or use default
  const gifUrl = concept.term
    ? conceptGifs[concept.term.toLowerCase()] || defaultGif
    : defaultGif;

  // Animation classes for new concepts with longer fade-in
  const animationClass = isNew ? "animate-slide-in-from-top opacity-0" : "";

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 mb-4 transition-all duration-1500 ${animationClass}`}
      style={{
        animationDelay: `${index * 1.5 + 1.5}s`, // Add extra base delay
        animationFillMode: "forwards",
        animationDuration: "3s", // Longer animation duration
      }}
    >
      <div className="flex items-center px-3 py-2 bg-gray-50 border-b border-gray-100">
        <span className="text-gray-500 font-medium text-sm mr-2">
          {concept.formattedTime || "N/A"}
        </span>
        <h3 className="text-lg font-semibold text-teal-800">
          "{concept.term}"
        </h3>
        <div
          className={`ml-3 px-2 py-0.5 rounded-full text-xs font-medium ${importanceColor}`}
        >
          {importance >= 8
            ? "Key concept"
            : importance >= 5
            ? "Important"
            : "Relevant"}
        </div>
        <button
          className="ml-auto text-gray-400 hover:text-yellow-500 transition-colors"
          onClick={toggleFavorite}
        >
          {isFavorited ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500"
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

      <div className="grid grid-cols-4 gap-4 p-4">
        {/* ASL Sign Column */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            ASL SIGN
          </h4>
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full ${logoColor} text-white flex items-center justify-center`}
            >
              {concept.term.charAt(0).toUpperCase()}
            </div>
            <p className="font-medium text-gray-900 text-sm">{concept.term}</p>
          </div>
        </div>

        {/* GIF Visualization Column */}
        <div className="bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center h-24">
          <img
            src={gifUrl}
            alt={`Visualization for ${concept.term}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Definition Column */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            DEFINITION
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            {concept.definition || "No definition available"}
          </p>

          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-gray-500">Importance:</span>
            <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${importanceBarColor}`}
                style={{ width: `${importance * 10}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-600">
              {importance}/10
            </span>
          </div>
        </div>

        {/* Timestamp Column */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            TIMESTAMP
          </h4>
          <div className="text-center">
            <p className="text-2xl font-semibold text-teal-800">
              {concept.formattedTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ASLConcept;
