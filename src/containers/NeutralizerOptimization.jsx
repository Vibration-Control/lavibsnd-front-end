// src/components/NeutralizerOptimization.js
import React from 'react';
import { Accordion, Button, Container } from 'react-bootstrap';
import PrimarySystemData from '../components/PrimarySystemData';
import NeutralizerData from '../components/NeutralizerData';
import CalculationParameters from '../components/CalculationParameters';
import Results from '../components/Results';
import { FormProvider, FormContext } from '../context/FormContext';

const NeutralizerOptimization = () => {
  return (
    <FormProvider>
      <Container>
        <div className="d-flex justify-content-between mt-4 mb-4">
          <Button variant="primary">Open an Existing Project</Button>
          <FormContext.Consumer>
            {({ handleSave }) => (
              <Button variant="success" onClick={handleSave}>Save</Button>
            )}
          </FormContext.Consumer>
        </div>

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Primary System Data</Accordion.Header>
            <Accordion.Body>
              <FormContext.Consumer>
                {({ formData, handleInputChange }) => (
                  <PrimarySystemData
                    formData={formData.primarySystemData}
                    handleInputChange={(value) => handleInputChange('primarySystemData', value)}
                  />
                )}
              </FormContext.Consumer>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Neutralizer Data</Accordion.Header>
            <Accordion.Body>
              <FormContext.Consumer>
                {({ formData, handleInputChange }) => (
                  <NeutralizerData
                    formData={formData.neutralizerData}
                    handleInputChange={(value) => handleInputChange('neutralizerData', value)}
                  />
                )}
              </FormContext.Consumer>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Calculation Parameters</Accordion.Header>
            <Accordion.Body>
              <FormContext.Consumer>
                {({ formData, handleInputChange }) => (
                  <CalculationParameters
                    formData={formData.calculationParameters}
                    handleInputChange={(value) => handleInputChange('calculationParameters', value)}
                  />
                )}
              </FormContext.Consumer>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Results</Accordion.Header>
            <Accordion.Body>
              <FormContext.Consumer>
                {({ formData, handleInputChange }) => (
                  <Results
                    formData={formData.results}
                    handleInputChange={(value) => handleInputChange('results', value)}
                  />
                )}
              </FormContext.Consumer>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </FormProvider>
  );
};

export default NeutralizerOptimization;
