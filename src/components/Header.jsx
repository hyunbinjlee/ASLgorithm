import React from "react";

const Header = () => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <h1 className="text-2xl font-bold text-teal-800">ASLgorithm</h1>
        <span className="ml-4 text-teal-600 text-sm">CS Lecture Analysis</span>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search concepts..."
          className="w-full py-3 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Header;
