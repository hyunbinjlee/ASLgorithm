import React from "react";
import ASLConcept from "./ASLConcept";

const ASLFeed = ({ concepts }) => {
  return (
    <div className="space-y-4">
      {concepts.map((concept) => (
        <ASLConcept key={concept.id} concept={concept} />
      ))}
    </div>
  );
};

export default ASLFeed;
