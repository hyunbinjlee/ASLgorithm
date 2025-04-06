import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import ASLConcept from "./ASLConcept";
import { identifyKeyCSConcepts } from "../utils/filter";
import { processConcepts } from "../utils/atlas";
import { hardcodedTranscript } from "../utils/transcript";

// Use forwardRef to expose methods to parent components
const ConceptsDisplay = forwardRef((props, ref) => {
  const [concepts, setConcepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newConcepts, setNewConcepts] = useState([]);
  const [showScrollNotification, setShowScrollNotification] = useState(false);
  const feedRef = useRef(null);
  const initialLoadComplete = useRef(false);

  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    addDemoConcept: () => {
      addDemoConcept();
    },
    addConcept: (concept) => {
      // Handle concepts coming from outside components like ControlPanel
      if (concept) {
        // Add the new concept as a "new concept" to trigger animation
        setNewConcepts((prev) => [concept]);

        // After animation delay, merge it into the main concepts list
        setTimeout(() => {
          setConcepts((prevConcepts) => [
            {
              ...concept,
              id: concept.id || Date.now(),
            },
            ...prevConcepts,
          ]);
          setNewConcepts([]);
        }, 7000); // Match our longer animation duration
      }
    },
  }));

  // Initial load of concepts
  useEffect(() => {
    async function loadConcepts() {
      try {
        setLoading(true);
        // Process the full pipeline
        const geminiConcepts = await identifyKeyCSConcepts(hardcodedTranscript);
        const mappedConcepts = await processConcepts(geminiConcepts);

        // Always populate from the top, even for initial load
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

  // Scroll to top when new concepts are added
  useEffect(() => {
    if (feedRef.current && newConcepts.length > 0) {
      // Scroll to top when new concepts appear
      feedRef.current.scrollTop = 0;
      setShowScrollNotification(false); // Hide notification when new concepts appear
    }
  }, [newConcepts]);

  // Show notification when user scrolls down
  useEffect(() => {
    if (!feedRef.current) return;

    const handleScroll = () => {
      if (feedRef.current.scrollTop > 200) {
        setShowScrollNotification(true);
      } else {
        setShowScrollNotification(false);
      }
    };

    const feedElement = feedRef.current;
    feedElement.addEventListener("scroll", handleScroll);

    return () => {
      if (feedElement) {
        feedElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  // Function to add a demo concept
  const addDemoConcept = () => {
    const demoConceptTemplates = [
      {
        term: "Binary Tree",
        formattedTime: "1:42",
        importance: 9,
        definition:
          "A tree data structure in which each node has at most two children.",
      },
      {
        term: "Graph",
        formattedTime: "2:15",
        importance: 8,
        definition:
          "A non-linear data structure consisting of vertices and edges.",
      },
      {
        term: "Sorting",
        formattedTime: "3:07",
        importance: 7,
        definition: "The process of arranging data in a particular order.",
      },
    ];

    // Randomly select a demo concept
    const randomIndex = Math.floor(Math.random() * demoConceptTemplates.length);
    const selectedTemplate = demoConceptTemplates[randomIndex];

    // Make sure we have a valid template before creating the new concept
    if (!selectedTemplate) {
      console.error("Demo concept template is undefined");
      return;
    }

    const newConcept = {
      ...selectedTemplate,
      id: Date.now(), // Ensure unique ID
    };

    // Add the new concept and mark it as new for animation
    setNewConcepts([newConcept]);

    // After animation delay, merge it into the main concepts list
    setTimeout(() => {
      setConcepts((prevConcepts) => [newConcept, ...prevConcepts]);
      setNewConcepts([]);
    }, 3000); // Longer wait for the slower animation to complete
  };

  const scrollToTop = () => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setShowScrollNotification(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-teal-800">Concepts</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={addDemoConcept}
            className="text-teal-600 hover:text-teal-800 text-sm bg-teal-50 hover:bg-teal-100 py-1 px-3 rounded-full transition-colors"
          >
            + Add Demo Concept
          </button>
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
      ) : concepts.length === 0 && newConcepts.length === 0 ? (
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
            className="space-y-4 max-h-[600px] overflow-y-auto pr-2 relative"
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

            {/* Existing concepts */}
            {concepts &&
              concepts.length > 0 &&
              concepts.map((concept, index) => (
                <ASLConcept
                  key={concept?.id || `concept-${index}`}
                  concept={concept}
                  index={index}
                  isNew={false}
                />
              ))}
          </div>

          {/* New concepts notification tab */}
          {showScrollNotification && (
            <button
              onClick={scrollToTop}
              className="fixed left-1/2 transform -translate-x-1/2 top-32 bg-teal-600 text-white py-2 px-4 rounded-full shadow-lg flex items-center z-10 hover:bg-teal-700 transition-colors duration-200 animate-pulse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              New concepts at top
            </button>
          )}
        </div>
      )}
    </div>
  );
});

// Add displayName for debugging purposes
ConceptsDisplay.displayName = "ConceptsDisplay";

export default ConceptsDisplay;
