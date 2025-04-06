import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import ASLConcept from "./ASLConcept";
import { identifyKeyCSConcepts } from "../utils/filter";
import { processConcepts } from "../utils/atlas";
import { hardcodedTranscript } from "../utils/transcript";

const ConceptsDisplay = forwardRef((props, ref) => {
  const [concepts, setConcepts] = useState([]);
  const [sortMode, setSortMode] = useState("time");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConcepts, setNewConcepts] = useState([]);
  const feedRef = useRef(null);
  const initialLoadComplete = useRef(false);

  const sortedConcepts = useMemo(() => {
    let sortableConcepts = [...concepts];

    sortableConcepts.forEach((concept, index) => {
      if (!concept.id) {
        concept.id = Date.now() + index;
      }
    });

    // Sorting based on selected mode
    if (sortMode === "importance") {
      return sortableConcepts.sort((a, b) => {
        // First, compare importance
        const importanceComparison = (b.importance || 0) - (a.importance || 0);

        // If importances are equal, fall back to sorting by time
        if (importanceComparison === 0) {
          return (b.id || 0) - (a.id || 0);
        }

        return importanceComparison;
      });
    }

    return sortableConcepts.sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [concepts, sortMode]);

  useEffect(() => {
    async function loadConcepts() {
      try {
        setLoading(true);
        const geminiConcepts = await identifyKeyCSConcepts(hardcodedTranscript);
        const mappedConcepts = await processConcepts(geminiConcepts);

        setConcepts(mappedConcepts);
        initialLoadComplete.current = true;
      } catch (err) {
        console.error("Error loading concepts:", err);
        setError("Failed to load concepts. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadConcepts();
  }, []);

  const changeSortMode = (mode) => {
    setSortMode(mode);

    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-teal-800">Concepts</h2>
        <div className="flex items-center space-x-4">
          {/* Sorting buttons */}
          <div className="bg-gray-100 rounded-full p-1 flex items-center space-x-1">
            <button
              onClick={() => changeSortMode("time")}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                sortMode === "time"
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Most Recent
            </button>
            <button
              onClick={() => changeSortMode("importance")}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                sortMode === "importance"
                  ? "bg-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Importance
            </button>
          </div>
          <span className="text-teal-600">View all &gt;</span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading concepts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      ) : sortedConcepts.length === 0 && newConcepts.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
          <p className="text-gray-600">
            No concepts found. Upload a lecture to begin analysis.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Feed container with scroll */}
          <div
            ref={feedRef}
            className="space-y-8 max-h-[850px] overflow-y-auto pr-5 relative"
          >
            {/* Animate new concepts from the top */}
            {newConcepts &&
              newConcepts.length > 0 &&
              newConcepts.map((concept, index) => (
                <ASLConcept
                  key={`new-${concept?.id || index}`}
                  concept={concept}
                  index={index}
                  isNew={true}
                />
              ))}

            {/* Sorted existing concepts */}
            {sortedConcepts &&
              sortedConcepts.length > 0 &&
              sortedConcepts.map((concept, index) => (
                <ASLConcept
                  key={concept?.id || `concept-${index}`}
                  concept={concept}
                  index={index}
                  isNew={false}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
});

ConceptsDisplay.displayName = "ConceptsDisplay";

export default ConceptsDisplay;
