import React from 'react';
import { Accordion, Button, Container } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import PrimarySystemData from '../components/PrimarySystemData';
import NeutralizerData from '../components/NeutralizerData';
import CalculationParameters from '../components/CalculationParameters';
import Results from '../components/Results';

const NeutralizerOptimization = () => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
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
        frequencyLowerBoundOpt: '',
        frequencyUpperBoundOpt: '',
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
    }
  });

  const onSubmit = (data) => {
    const payload = {
      primary_system_data: data.primarySystemData,
      neutralizer_data: data.neutralizerData,
      calculation_parameters: data.calculationParameters,
      results: data.results
    };
    console.log('Saving project with payload:', payload);
    // Add your API call logic here
  };

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <div className="d-flex justify-content-between mt-4 mb-4">
          <Button variant="primary">Open an Existing Project</Button>
          <Button variant="success" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </div>

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Primary System Data</Accordion.Header>
            <Accordion.Body>
              <PrimarySystemData />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Neutralizer Data</Accordion.Header>
            <Accordion.Body>
              <NeutralizerData />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Calculation Parameters</Accordion.Header>
            <Accordion.Body>
              <CalculationParameters control={control} errors={errors}/>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Results</Accordion.Header>
            <Accordion.Body>
              <Results />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </FormProvider>
  );
};

export default NeutralizerOptimization;
