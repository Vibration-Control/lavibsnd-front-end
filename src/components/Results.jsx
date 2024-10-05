import React from 'react';

const Results = ({ formData, handleInputChange }) => {
  return (
    <textarea
      className="form-control"
      placeholder="Enter results"
      value={formData}
      onChange={(e) => handleInputChange(e.target.value)}
    />
  );
};

export default Results;
