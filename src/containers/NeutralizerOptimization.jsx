import React, { useState } from 'react';
import { Accordion, Button, Container } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import PrimarySystemData from '../components/PrimarySystemData';
import NeutralizerData from '../components/NeutralizerData';
import CalculationParameters from '../components/CalculationParameters';
import Results from '../components/Results';
import { optimizeNeutralizer } from '../services/apiService';

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

  const parseNeutralizerNumericFields = (neutralizers) => {
    neutralizers.forEach((neutralizer) => {
      neutralizer.mass = Number(neutralizer.mass)
      neutralizer.optimizationVariables.integer[0].range = Number(neutralizer.optimizationVariables.integer[0].range)
      neutralizer.optimizationVariables.integer[0].range = Number(neutralizer.optimizationVariables.integer[1].range)
      neutralizer.optimizationVariables.real[0].lowerBound = Number(neutralizer.optimizationVariables.real[0].lowerBound)
      neutralizer.optimizationVariables.real[0].upperBound = Number(neutralizer.optimizationVariables.real[0].upperBound)
      neutralizer.optimizationVariables.real[0].discretization = Number(neutralizer.optimizationVariables.real[0].discretization)
      neutralizer.optimizationVariables.real[1].lowerBound = Number(neutralizer.optimizationVariables.real[1].lowerBound)
      neutralizer.optimizationVariables.real[1].upperBound = Number(neutralizer.optimizationVariables.real[1].upperBound)
      neutralizer.optimizationVariables.real[1].discretization = Number(neutralizer.optimizationVariables.real[1].discretization)
      neutralizer.optimizationVariables.integer[2].range = Number(neutralizer.optimizationVariables.integer[2].range)
    })
  }

  const parseViscoelasticMaterialsNumericFields = (viscoelasticMaterials) => {
    viscoelasticMaterials.forEach((viscoelasticMaterial) => {
      viscoelasticMaterial.TT1 = Number(viscoelasticMaterial.TT1)
      viscoelasticMaterial.TT0 = Number(viscoelasticMaterial.TT0)
      viscoelasticMaterial.GL = Number(viscoelasticMaterial.GL) 
      viscoelasticMaterial.GH = Number(viscoelasticMaterial.GH) 
      viscoelasticMaterial.FI = Number(viscoelasticMaterial.FI) 
      viscoelasticMaterial.beta = Number(viscoelasticMaterial.beta) 
      viscoelasticMaterial.teta1 = Number(viscoelasticMaterial.teta1) 
      viscoelasticMaterial.teta2 = Number(viscoelasticMaterial.teta2) 
    })
  }

  const { handleSubmit, setValue } = methods;
  console.log('Updated Form Values:', methods.getValues());
  const onSubmit = (data) => {
		const naturalFrequencies = [],
					modalDamping = [],
					modes = [];

		let processingModes = '';

		// primarySystemData é tratado de maneira diferente por causa da divergencia entre modos de armazenamento
		data.primarySystemData.rows.forEach((row) => {
			naturalFrequencies.push(row.naturalFrequency);
			modalDamping.push(row.modalDamping)
			// Converte a string row.modes para o formato de array de numeros
			processingModes = row.modes.substring(1, row.modes.length-1) 
			processingModes = processingModes.split(',').map(Number) 
			modes.push(processingModes) 
		})

    const payload = {
      ...data,
			primarySystemNaturalFrequencies: naturalFrequencies.map(Number),
			primarySystemModalDamping: modalDamping.map(Number),
			primarySystemModes: modes
    };

		delete payload.primarySystemData;

    
    // Bloco comentado porque, na funcao parseNeutralizerNumericFields, não foram tratados os diferentes tipos de neutralizadores. Quando a função tiver esse tratamento, será descomentado.
    /* parseNeutralizerNumericFields(payload.neutralizers)
    parseViscoelasticMaterialsNumericFields(payload.additionalParameters.viscoelasticMaterials) */

    console.log('Saving project with payload:', payload)
    // Add your API call logic here
  };

  const onOptimize = async () => {
    const formValues = methods.getValues();
    const payload = { ...formValues };
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

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const text = await file.text();
          const jsonData = JSON.parse(text);

          if (jsonData) {
						const rows = jsonData.primarySystemNaturalFrequencies.map((element, i) => ({
							enabled: false,
							naturalFrequency: jsonData.primarySystemNaturalFrequencies[i],
							modalDamping: jsonData.primarySystemModalDamping[i],
							modes: JSON.stringify(jsonData.primarySystemModes[i]) 					
						}));

						setValue('primarySystemData.rows', rows, { shouldValidate: true });

            Object.entries(jsonData).forEach(([key, value]) => {
              setValue(key, value, { shouldValidate: true });
            });
						console.log((jsonData) || 'erro')
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
              <Results optimizationResult={optimizationResult} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </FormProvider>
  );
};

export default NeutralizerOptimization;
