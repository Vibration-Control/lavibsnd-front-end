import React from 'react';

const PrimarySystemData = ({ formData, handleInputChange }) => {
  return (
    <textarea
      className="form-control"
      placeholder="Enter primary system data"
      value={formData}
      onChange={(e) => handleInputChange(e.target.value)}
    />
  );
};

export default PrimarySystemData;
