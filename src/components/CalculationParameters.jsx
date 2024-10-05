import React from 'react';

const CalculationParameters = ({ formData, handleInputChange }) => {
  return (
    <textarea
      className="form-control"
      placeholder="Enter calculation parameters"
      value={formData}
      onChange={(e) => handleInputChange(e.target.value)}
    />
  );
};

export default CalculationParameters;
