// src/context/FormContext.js
import React, { createContext, useState } from 'react';

// Create a context
export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    primarySystemData: {
      naturalFrequencies: [],
      modalDamping: [],
      modes: []
    },
    neutralizerData: {
      neutralizerType: [],
      modalPosition: [],
      naturalFrequencyLowerBound: '',
      naturalFrequencyUpperBound: '',
      dampingRatioLowerBound: '',
      dampingRatioUpperBound: '',
      viscoelasticMaterial: [],
      dynamicStiffness: []
    },
    calculationParameters: {
      frequencyLowerBoundOpt: 1.0,
      frequencyUpperBoundOpt: 2.0,
      frequencyDiscretizationOpt: '',
      excitationPointOpt: '',
      responsePointOpt: '',
      frequencyLowerBoundPlot: '',
      frequencyUpperBoundPlot: '',
      frequencyDiscretizationPlot: '',
      excitationPointPlot: '',
      responsePointPlot: '',
      populationSize: '',
      generations: '',
      crossover: '',
      mutation: ''
    },
    results: {}
  });

  const handleInputChange = (section, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: value
    }));
  };

  const handleSave = () => {
    const payload = {
      primary_system_data: formData.primarySystemData,
      neutralizer_data: formData.neutralizerData,
      calculation_parameters: formData.calculationParameters,
      results: formData.results
    };
    console.log('Saving project with payload:', payload);
    // Add your API call logic here
  };

  return (
    <FormContext.Provider value={{ formData, handleInputChange, handleSave }}>
      {children}
    </FormContext.Provider>
  );
};
