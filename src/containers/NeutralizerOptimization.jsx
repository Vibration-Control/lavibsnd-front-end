import React, { useState } from 'react';
import { Accordion, Button, Container } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import PrimarySystemData from '../components/PrimarySystemData';
import NeutralizerData from '../components/NeutralizerData';
import CalculationParameters from '../components/CalculationParameters';
import Results from '../components/Results';
import { optimizeNeutralizer } from '../services/apiService';
import initialMaterials from '../Data/ViscoelasticMaterials.json';

const NeutralizerOptimization = () => {
  const [optimizationResult, setOptimizationResult] = useState(null);
  const methods = useForm({
    defaultValues: {
      primarySystemNaturalFrequencies: [],
      primarySystemModalDamping: [],
      primarySystemModes: [],
      neutralizers: [
        {
          mass: 0.0,
          massTypeUserDefined: true,
          optimizationVariables: {
            real: [
              {
                name: "frequency",
                lowerBound: '',
                upperBound: '',
                discretization: ''
              }
            ],
            integer: [
              {
                name: "type",
                range: []
              },
              {
                name: "modal_position",
                range: []
              },
              {
                name: "viscoelastic_material",
                range: []
              }
            ]
          }
        }
      ],
      additionalParameters: {
        viscoelasticMaterials: initialMaterials,
        temperatureDetuning: [],
        userDefinedDynamicStiffnesses: [
          {
            name: '',
            range: []
          }
        ]
      },
      excitationNodeOptimization: '',
      responseNodeOptimization: '',
      excitationNodePlot: '',
      responseNodePlot: '',
      plotType: '',
      objectiveFunctionSearchLowerBound: '',
      objectiveFunctionSearchUpperBound: '',
      objectiveFunctionSearchDiscretization: '',
      plotLowerBound: '',
      plotUpperBound: '',
      plotDiscretization: '',
      geneticAlgorithm: {
        populationSize: '',
        generations: '',
        crossover: '',
        mutation: ''
      }
    }
  });

  const { handleSubmit, setValue } = methods;

  const normalizePrimarySystemModes = (modes) => {
    const normalizedModes = []
    let processingModes
    
    modes.forEach((mode) => {
      if (typeof mode == 'string') {
			  processingModes = mode.split(',').map(Number) 
        normalizedModes.push(processingModes)
      } else {
        normalizedModes.push(mode)
      }
    })

    modes = normalizedModes
    return modes
  }

  console.log('Updated Form Values: ', methods.getValues());
  const onSubmit = (data) => {
    const payload = { ...data };

    payload.primarySystemModes = normalizePrimarySystemModes(payload.primarySystemModes)
    console.log('Saving project with payload:', payload)
    // Add your API call logic here
  };

  const onOptimize = async () => {
    const formValues = methods.getValues();
    const payload = { ...formValues };

    payload.primarySystemModes = normalizePrimarySystemModes(payload.primarySystemModes)
    try {
      const result = await optimizeNeutralizer(payload);
      console.log('Optimization result:', result);
      setOptimizationResult(result); // <-- Save it to the state
    } catch (error) {
      console.error('Optimization failed:', error);
    }
  };

  const openExistingProject = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    const currentViscoelasticMaterials = (methods.getValues().additionalParameters.viscoelasticMaterials || []) // temporary logic

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const text = await file.text();
          const jsonData = JSON.parse(text);

          if (jsonData) {
            const newViscoelasticMaterials = (jsonData.additionalParameters?.viscoelasticMaterials || []) // temporary logic
            const mergedForm = {
              ...jsonData,
              additionalParameters: {
                ...(jsonData.additionalParameters || {}),
                viscoelasticMaterials: [...currentViscoelasticMaterials, ...newViscoelasticMaterials]
              }
            }

            methods.reset(mergedForm)
						console.log((mergedForm) || 'erro')
            console.log('Updated Form Values:', methods.getValues());
          }          
        } catch (error) {
          console.error('Error reading or parsing the file:', error);
        }
      }
    };

    fileInput.click();
  };

  return (
    <FormProvider {...methods}>
      <Container>
        <div className="d-flex justify-content-between mt-4 mb-4">
          <Button variant="primary" onClick={openExistingProject}>
            Open an Existing Project
          </Button>
          <Button variant="success" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
          <Button variant="info" onClick={onOptimize}>
            Optimize
          </Button>
        </div>

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Primary System Data</Accordion.Header>
            <Accordion.Body>
              <PrimarySystemData control={methods.control} setValue={methods.setValue}/>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Neutralizer Data</Accordion.Header>
            <Accordion.Body>
              <NeutralizerData control={methods.control} errors={methods.errors} getValues={methods.getValues} setValue={methods.setValue} clearErrors={methods.clearErrors} />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Calculation Parameters</Accordion.Header>
            <Accordion.Body>
              <CalculationParameters control={methods.control} errors={methods.formState.errors} />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Results</Accordion.Header>
            <Accordion.Body>
              <Results optimizationResult={optimizationResult} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </FormProvider>
  );
};

export default NeutralizerOptimization;
