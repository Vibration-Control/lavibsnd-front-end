import React from 'react';

const Results = ({ optimizationResult }) => {
  if (!optimizationResult) {
    return <p>No optimization result yet.</p>;
  }

  return (
    <div>
      <h4>Optimization Result:</h4>
      <pre>{JSON.stringify(optimizationResult, null, 2)}</pre>
    </div>
  );
};

export default Results;
