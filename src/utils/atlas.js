// utils/atlas.js

/**
 * Step 4: Map concepts identified by Gemini to Atlas dictionary and format for frontend display
 */
async function mapConceptsToAtlas(geminiConcepts) {
  try {
    // Fetch Atlas dictionary
    const atlasDictionary = await fetchAtlasDictionary();

    // Create a normalized mapping of Atlas terms for easier matching
    const normalizedAtlasTerms = createNormalizedMapping(atlasDictionary);

    // Map Gemini concepts to Atlas terms in a format compatible with ASLConcept.jsx
    const formattedConcepts = [];

    for (const [conceptName, conceptDetails] of Object.entries(
      geminiConcepts
    )) {
      // Normalize the concept name for matching
      const normalizedConcept = normalizeString(conceptName);

      // Try to find a match in Atlas dictionary
      let atlasMatch = findBestMatch(
        normalizedConcept,
        normalizedAtlasTerms,
        conceptDetails.related_terms
      );

      // Create a concept object in the format expected by ASLConcept.jsx
      const conceptObject = {
        term: conceptName,
        formattedTime: conceptDetails.timestamp, // Use timestamp as formattedTime
        importance: conceptDetails.importance,
        definition: atlasMatch
          ? atlasDictionary[atlasMatch].definition
          : conceptDetails.definition,
        related_terms: conceptDetails.related_terms,
      };

      // Add ASL references if there's a match in Atlas
      if (atlasMatch) {
        // console.log('theres a match!')
        conceptObject.asl_image_link =
          atlasDictionary[atlasMatch].asl_image_link;
        conceptObject.asl_vid_link = atlasDictionary[atlasMatch].asl_vid_link;
        conceptObject.diagram_image_link =
          atlasDictionary[atlasMatch].diagram_image_link;
          // console.log('conceptObject is: ' + conceptObject)
      }

      formattedConcepts.push(conceptObject);
    }

    // Sort by importance and timestamp
    formattedConcepts.sort((a, b) => {
      if (b.importance !== a.importance) {
        return b.importance - a.importance; // Higher importance first
      }
      // If same importance, sort by timestamp
      return parseTimestamp(a.formattedTime) - parseTimestamp(b.formattedTime);
    });

    return formattedConcepts;
  } catch (error) {
    console.error("Error mapping concepts to Atlas:", error);
    throw error;
  }
}

/**
 * Helper function to fetch Atlas dictionary
 */
async function fetchAtlasDictionary() {
  try {

    // console.log('trying to fetch atlas dictionary');

    const dbResponse = await fetch('http://localhost:3000/dbGet', {
      method: 'GET',
    });

    if (!dbResponse.ok) {
      throw new Error('error with db fetch from express')
    }
    const dbData = await dbResponse.json();
    // console.log(dbData[0])
    return dbData[0];

    // Simulating a database call to Atlas - replace with actual MongoDB query
    // return {
    //   Array: {
    //     definition:
    //       "A collection of elements stored at contiguous memory locations, identified by indices.",
    //     diagram_image_link:
    //       "https://en.wikipedia.org/wiki/Unified_Modeling_Language#/media/File:UML_diagram.png",
    //     asl_image_link:
    //       "https://en.wikipedia.org/wiki/American_Sign_Language#/media/File:American_Sign_Language.png",
    //     asl_gif_link:
    //       "https://en.wikipedia.org/wiki/GIF#/media/File:Rotating_earth_(large).gif",
    //   },
    //   "Linked List": {
    //     definition:
    //       "A linear data structure where elements are stored in nodes that point to the next node.",
    //     diagram_image_link:
    //       "https://en.wikipedia.org/wiki/Unified_Modeling_Language#/media/File:UML_diagram.png",
    //     asl_image_link:
    //       "https://en.wikipedia.org/wiki/American_Sign_Language#/media/File:American_Sign_Language.png",
    //     asl_gif_link:
    //       "https://en.wikipedia.org/wiki/GIF#/media/File:Rotating_earth_(large).gif",
    //   },
    //   Stack: {
    //     definition:
    //       "A linear data structure that follows the Last In First Out (LIFO) principle.",
    //     diagram_image_link: "https://example.com/stack-diagram.png",
    //     asl_image_link: "https://example.com/stack-asl.png",
    //     asl_gif_link: "https://example.com/stack-asl.gif",
    //   },
    //   Queue: {
    //     definition:
    //       "A linear data structure that follows the First In First Out (FIFO) principle.",
    //     diagram_image_link: "https://example.com/queue-diagram.png",
    //     asl_image_link: "https://example.com/queue-asl.png",
    //     asl_gif_link: "https://example.com/queue-asl.gif",
    //   },
    //   "Binary Tree": {
    //     definition:
    //       "A tree data structure in which each node has at most two children.",
    //     diagram_image_link: "https://example.com/binary-tree-diagram.png",
    //     asl_image_link: "https://example.com/binary-tree-asl.png",
    //     asl_gif_link: "https://example.com/binary-tree-asl.gif",
    //   },
    //   "Binary Search Tree": {
    //     definition:
    //       "A binary tree with the property that for each node, all elements in the left subtree are less than the node, and all elements in the right subtree are greater.",
    //     diagram_image_link: "https://example.com/bst-diagram.png",
    //     asl_image_link: "https://example.com/bst-asl.png",
    //     asl_gif_link: "https://example.com/bst-asl.gif",
    //   },
    //   Graph: {
    //     definition:
    //       "A non-linear data structure consisting of vertices and edges connecting these vertices.",
    //     diagram_image_link: "https://example.com/graph-diagram.png",
    //     asl_image_link: "https://example.com/graph-asl.png",
    //     asl_gif_link: "https://example.com/graph-asl.gif",
    //   },
    //   "Breadth-First Search": {
    //     definition:
    //       "A graph traversal algorithm that explores all neighbors at the present depth before moving to vertices at the next depth level.",
    //     diagram_image_link: "https://example.com/bfs-diagram.png",
    //     asl_image_link: "https://example.com/bfs-asl.png",
    //     asl_gif_link: "https://example.com/bfs-asl.gif",
    //   },
    //   "Depth-First Search": {
    //     definition:
    //       "A graph traversal algorithm that explores as far as possible along each branch before backtracking.",
    //     diagram_image_link: "https://example.com/dfs-diagram.png",
    //     asl_image_link: "https://example.com/dfs-asl.png",
    //     asl_gif_link: "https://example.com/dfs-asl.gif",
    //   },
    //   Recursion: {
    //     definition:
    //       "A method where the solution to a problem depends on solutions to smaller instances of the same problem.",
    //     diagram_image_link: "https://example.com/recursion-diagram.png",
    //     asl_image_link: "https://example.com/recursion-asl.png",
    //     asl_gif_link: "https://example.com/recursion-asl.gif",
    //   },
    //   Tree: {
    //     definition:
    //       "A hierarchical data structure with a root node and branches.",
    //     diagram_image_link: "https://example.com/tree-diagram.png",
    //     asl_image_link: "https://example.com/tree-asl.png",
    //     asl_gif_link: "https://example.com/tree-asl.gif",
    //   },
    //   "Spanning Tree": {
    //     definition:
    //       "A subgraph that includes all the vertices of the original graph and is a tree.",
    //     diagram_image_link: "https://example.com/spanning-tree-diagram.png",
    //     asl_image_link: "https://example.com/spanning-tree-asl.png",
    //     asl_gif_link: "https://example.com/spanning-tree-asl.gif",
    //   },
    // };
  } catch (error) {
    console.error("Error fetching Atlas dictionary:", error);
    throw error;
  }
}

/**
 * Create a normalized mapping of Atlas terms
 */
function createNormalizedMapping(atlasDictionary) {
  const normalizedMap = {};

  for (const term of Object.keys(atlasDictionary)) {
    const normalizedTerm = normalizeString(term);
    // console.log('normalizedTerm: ' + normalizedTerm)
    normalizedMap[normalizedTerm] = term;

    // Add common variations
    if (term.includes(" ")) {
      // Add hyphenated version
      const hyphenated = term.replace(/\s+/g, "-").toLowerCase();
      normalizedMap[hyphenated] = term;

      // Add version without spaces
      const noSpaces = term.replace(/\s+/g, "").toLowerCase();
      normalizedMap[noSpaces] = term;
    }
  }

  return normalizedMap;
}

/**
 * Normalize a string for comparison
 */
function normalizeString(str) {
  return str
    .toLowerCase()
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .replace(/\s+/g, " ") // Standardize spaces
    .trim(); // Remove leading/trailing spaces
}

/**
 * Find the best match for a concept in the Atlas dictionary
 */
function findBestMatch(
  normalizedConcept,
  normalizedAtlasTerms,
  relatedTerms = []
) {
  // First try direct match
  if (normalizedAtlasTerms[normalizedConcept]) {
    return normalizedAtlasTerms[normalizedConcept];
  }

  // Then try variations of the concept
  const variations = [
    normalizedConcept,
    normalizedConcept.replace(/\s+/g, ""), // No spaces
    normalizedConcept.replace(/\s+/g, "-"), // Hyphenated
    normalizedConcept.replace(/[^\w\s]/g, ""), // Remove special chars
  ];

  for (const variation of variations) {
    if (normalizedAtlasTerms[variation]) {
      return normalizedAtlasTerms[variation];
    }
  }

  // Try related terms/synonyms
  if (relatedTerms && relatedTerms.length > 0) {
    for (const term of relatedTerms) {
      const normalizedTerm = normalizeString(term);
      if (normalizedAtlasTerms[normalizedTerm]) {
        return normalizedAtlasTerms[normalizedTerm];
      }
    }
  }

  // If still no match, try looser matching
  for (const atlasKey of Object.keys(normalizedAtlasTerms)) {
    if (
      atlasKey.includes(normalizedConcept) ||
      normalizedConcept.includes(atlasKey)
    ) {
      return normalizedAtlasTerms[atlasKey];
    }
  }

  // No match found
  return null;
}

/**
 * Parse timestamp string (mm:ss) to seconds
 */
function parseTimestamp(timestamp) {
  if (!timestamp) return 0;

  const parts = timestamp.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
}

/**
 * Process concepts for frontend display
 */
async function processConcepts(geminiConcepts) {
  try {
    console.log("Mapping concepts to Atlas dictionary...");
    const formattedConcepts = await mapConceptsToAtlas(geminiConcepts);

    console.log("Formatted concepts for frontend:");
    console.log(JSON.stringify(formattedConcepts, null, 2));

    return formattedConcepts;
  } catch (error) {
    console.error("Error processing concepts:", error);
    throw error;
  }
}

// For testing - this can be called directly to test with sample data
async function testAtlasMapping() {
  const sampleGeminiOutput = {
    "Breath-first search": {
      definition:
        "A graph traversal algorithm that explores a graph level by level, starting from a root node and visiting all its neighbors before moving to the next level.",
      timestamp: "0:00",
      related_terms: ["BFS", "level order traversal"],
      importance: 10,
    },
    "Depth-first search": {
      definition:
        "A graph traversal algorithm that explores a graph by going as deep as possible along each branch before backtracking.",
      timestamp: "0:09",
      related_terms: ["DFS", "pre-order traversal"],
      importance: 10,
    },
    "Graph traversal": {
      definition:
        "The process of systematically visiting all the nodes (vertices) in a graph.",
      timestamp: "0:11",
      related_terms: [],
      importance: 9,
    },
  };

  return await processConcepts(sampleGeminiOutput);
}

// Export functions for use in other modules
export { processConcepts, mapConceptsToAtlas, testAtlasMapping };
