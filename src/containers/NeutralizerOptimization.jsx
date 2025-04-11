import React from 'react';
import { Accordion, Button, Container } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import PrimarySystemData from '../components/PrimarySystemData';
import NeutralizerData from '../components/NeutralizerData';
import CalculationParameters from '../components/CalculationParameters';
import Results from '../components/Results';
import { optimizeNeutralizer } from '../services/apiService';

const NeutralizerOptimization = () => {
  const methods = useForm({
    defaultValues: {
      primarySystemNaturalFrequencies: [],
      primarySystemModalDamping: [],
      primarySystemModes: [],
      neutralizers: [
        {
          mass: 0.0,
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
        viscoelasticMaterials: [
          {
            name: '',
            TT1: '',
            TT0: '',
            GH: '',
            GL: '',
            beta: '',
            FI: '',
            teta1: '',
            teta2: ''
          }
        ],
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
  console.log('Updated Form Values:', methods.getValues());
  const onSubmit = (data) => {
    for (let i = 0; i < data.primarySystemModes.length; i++) {
        data.primarySystemNaturalFrequencies[i] = data.primarySystemModes[i].naturalFrequency;
        data.primarySystemModalDamping[i] = data.primarySystemModes[i].modalDamping;
    }
    delete data.primarySystemModes; 

    const payload = {
        ...data
    };

    console.log('Saving project with payload:', payload);
    // Add your API call logic here
};

  const onOptimize = async () => {
    const formValues = methods.getValues();
    const payload = {...formValues};
    try {
      const result = await optimizeNeutralizer(payload);
      console.log('Optimization result:', result);
      // Handle the result (e.g., display in Results component)
    } catch (error) {
      console.error('Optimization failed:', error);
    }
  };

  const openExistingProject = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const text = await file.text();
          const jsonData = JSON.parse(text);

          if (jsonData) {
            Object.entries(jsonData).forEach(([key, value]) => {
              setValue(key, value, { shouldValidate: true });
            });
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
              <PrimarySystemData control={methods.control} errors={methods.errors} />
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
              <Results />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </FormProvider>
  );
};

export default NeutralizerOptimization;
