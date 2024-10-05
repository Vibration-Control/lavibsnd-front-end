import React, { useState } from 'react';
import { Accordion, Button, Container } from 'react-bootstrap';
import PrimarySystemData from '../components/PrimarySystemData';
import NeutralizerData from '../components/NeutralizerData';
import CalculationParameters from '../components/CalculationParameters';
import Results from '../components/Results';

const NeutralizerOptimization = () => {
  const [formData, setFormData] = useState({
    primarySystemData: '',
    neutralizerData: '',
    calculationParameters: '',
    results: ''
  });

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

  const handleInputChange = (section, value) => {
    setFormData({
      ...formData,
      [section]: value
    });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between mt-4 mb-4">
        <Button variant="primary">Open an Existing Project</Button>
        <Button variant="success" onClick={handleSave}>Save</Button>
      </div>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Primary System Data</Accordion.Header>
          <Accordion.Body>
            <PrimarySystemData
              formData={formData.primarySystemData}
              handleInputChange={(value) => handleInputChange('primarySystemData', value)}
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Neutralizer Data</Accordion.Header>
          <Accordion.Body>
            <NeutralizerData
              formData={formData.neutralizerData}
              handleInputChange={(value) => handleInputChange('neutralizerData', value)}
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Calculation Parameters</Accordion.Header>
          <Accordion.Body>
            <CalculationParameters
              formData={formData.calculationParameters}
              handleInputChange={(value) => handleInputChange('calculationParameters', value)}
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Results</Accordion.Header>
          <Accordion.Body>
            <Results
              formData={formData.results}
              handleInputChange={(value) => handleInputChange('results', value)}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
};

export default NeutralizerOptimization;
