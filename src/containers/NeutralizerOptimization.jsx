import { useState, useRef } from 'react';
import { Hourglass } from 'lucide-react';
import { Accordion, Button, Container } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import PrimarySystemData from '../components/PrimarySystemData';
import NeutralizerData, { getFieldPath } from '../components/NeutralizerData';
import CalculationParameters from '../components/CalculationParameters';
import Results from '../components/Results';
import { optimizeNeutralizer } from '../services/apiService';
import initialMaterials from '../Data/ViscoelasticMaterials.json';

const NeutralizerOptimization = () => {
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [fileHandle, setFileHandle] = useState(null); // will store FileSystemFileHandle
  const [fileName, setFileName] = useState(null); // store file name for display/fallback

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [totalTime, setTotalTime] = useState(null);
  const [cancelled, setCancelled] = useState(false);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const activeRequestRef = useRef(null);

  const methods = useForm({
    defaultValues: {
      primarySystemNaturalFrequencies: [],
      primarySystemModalDamping: [],
      primarySystemModes: [],
      neutralizers: [],
      additionalParameters: {
        viscoelasticMaterials: initialMaterials,
        temperatureDetuning: [],
        userDefinedDynamicStiffnesses: [],
        PrimarySystemNodePositions: []
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

  const { setValue } = methods;


  const normalizePrimarySystemModes = (modes) => {
    const normalizedModes = [];
    let processingModes, auxMode;

    modes.forEach((mode) => {
      if (typeof mode === 'string') {
        auxMode = mode.replace(/\[/, '').replace(/\]/, '')
        processingModes = auxMode.split(',').map(Number);
        normalizedModes.push(processingModes);
      } else {
        normalizedModes.push(mode);
      }
    });

    return normalizedModes;
  };

  const normalizeModalPositions = (neutralizers) => {
    let modalPositionPath, currentModalPosition, auxModalPosition

    neutralizers.forEach((row, index) => {
      modalPositionPath = getFieldPath('integer', row, 'modal_position', index, 'range')
      currentModalPosition = methods.getValues(modalPositionPath)

      if (typeof currentModalPosition === 'string') {
        auxModalPosition = currentModalPosition.replace(/\[/, '').replace(/\]/, '').split(',').map(Number)
      } else {
        auxModalPosition = currentModalPosition
      }
        
      methods.setValue(modalPositionPath, auxModalPosition)
    })
  }

  const formatPayloadForApi = (input) => {

    const convertStringArray = (value) => {
      if (typeof value === "string") {
        const trimmed = value.trim()

        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            return JSON.parse(trimmed)
          } catch {
            return value
          }
        }
      }

      return value
    }

    const shouldRemoveObject = (obj) => {
      if (obj && typeof obj === "object") {
        if ("lowerBound" in obj && obj.lowerBound === "") return true
        if ("range" in obj && Array.isArray(obj.range) && obj.range.length === 0) return true
      }

      return false
    }

    const traverse = (value) => {

      if (Array.isArray(value)) {
        const newArray = []

        for (const item of value) {

          if (typeof item === "object" && item !== null) {
            if (shouldRemoveObject(item)) continue
          }

          newArray.push(traverse(item))
        }

        return newArray
      }

      if (typeof value === "object" && value !== null) {
        const newObj = {}

        for (const key in value) {
          newObj[key] = traverse(value[key])
        }

        return newObj
      }

      return convertStringArray(value)
    }
    return traverse(input)
  }
  const startTimer = () => {
    startTimeRef.current = Date.now();
    setElapsedTime(0);

    intervalRef.current = setInterval(() => {
      const diff = Date.now() - startTimeRef.current;
      setElapsedTime(diff);
    }, 100);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const final = Date.now() - startTimeRef.current;
    setTotalTime(final);
  };

  const onOptimize = async () => {
    const requestId = Date.now();
    activeRequestRef.current = requestId;

    setIsOptimizing(true);
    setCancelled(false);
    setCompleted(false);
    setTotalTime(null);

    startTimer();

    const formValues = methods.getValues();
    const payload = { ...formValues };

    payload.primarySystemModes = normalizePrimarySystemModes(
      payload.primarySystemModes
    );

    normalizeModalPositions(payload.neutralizers);

    const formatedPayload = formatPayloadForApi(payload);

    try {
      const result = await optimizeNeutralizer(formatedPayload);

      if (activeRequestRef.current !== requestId) return;

      setOptimizationResult(result);
      setCompleted(true);
      setCancelled(false);

      // hide checkmark after 5s
      setTimeout(() => setCompleted(false), 5000);

    } catch (error) {
      if (activeRequestRef.current !== requestId) return;
      console.error(error);
    } finally {
      if (activeRequestRef.current === requestId) {
        setIsOptimizing(false);
        activeRequestRef.current = null;
        stopTimer();
      }
    }
  };

  const cancelOptimization = () => {
    activeRequestRef.current = null;

    setIsOptimizing(false);
    stopTimer();

    setCancelled(true);
    setCompleted(false);
  };

  /**
   * Opens an existing project JSON using the File System Access API (preferred)
   */
  const openExistingProject = async () => {
    try {
      // Attempt to use modern File System Access API
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] }
          }
        ],
        excludeAcceptAllOption: true,
        multiple: false
      });

      const file = await handle.getFile();
      const text = await file.text();
      const jsonData = JSON.parse(text);

      setFileHandle(handle);
      setFileName(file.name);

      const currentViscoelasticMaterials =
        methods.getValues().additionalParameters.viscoelasticMaterials || [];

      // populate form values
      Object.entries(jsonData).forEach(([key, value]) => {
        setValue(key, value, { shouldValidate: true });
      });

      const newViscoelasticMaterials =
        jsonData.additionalParameters?.viscoelasticMaterials || [];
      setValue(
        'additionalParameters.viscoelasticMaterials',
        [...currentViscoelasticMaterials, ...newViscoelasticMaterials]
      );

      console.log('Loaded JSON:', jsonData);
    } catch (error) {
      console.error('Error opening file:', error);
      alert(
        'Could not open file. If your browser does not support the File System Access API, use "Save As New" for saving.'
      );
    }
  };

  /**
   * Save changes directly to the same file using File System Access API
   */
  const handleSave = async () => {
    if (!fileHandle) return;

    try {
      const updatedData = methods.getValues();
      const formatedPayload = formatPayloadForApi(updatedData)
      const jsonString = JSON.stringify(formatedPayload, null, 2);
      const writable = await fileHandle.createWritable();
      await writable.write(jsonString);
      await writable.close();
      console.log('File successfully overwritten:', fileName);
    } catch (error) {
      console.error('Error saving file:', error);
      alert(
        'Could not overwrite file. Try "Save As New" instead.'
      );
    }
  };

  /**
   * Save as new file (always available)
   */
  const handleSaveAsNew = () => {
    try {
      const updatedData = methods.getValues();
      const formatedPayload = formatPayloadForApi(updatedData)
      const jsonString = JSON.stringify(formatedPayload, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'neutralizer_project.json';
      a.click();
      URL.revokeObjectURL(url);
      console.log('Project saved as new file');
    } catch (error) {
      console.error('Error saving new file:', error);
    }
  };

  const openRst = async () => {
    try {
      // Let user pick a file
      const fileHandle = await window.showOpenFilePicker({
        types: [
          {
            description: '.rst Files',
            accept: { 'application/octet-stream': ['.rst'] },
          },
        ],
        multiple: false,
      });

      const file = await fileHandle[0].getFile();

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/convertRst", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to read .rst file from backend");
      }

      const data = await response.json();

      // Existing values
      methods.setValue("primarySystemNaturalFrequencies", data.PrimarySystemNaturalFrequencies || []);
      methods.setValue("primarySystemModes", data.PrimarySystemModes || []);

      // ✅ NEW: Set node positions under additionalParameters
      methods.setValue(
        "additionalParameters.PrimarySystemNodePositions",
        data.PrimarySystemNodePositions || []
      );

      console.log("RST loaded:", data);

    } catch (error) {
      console.error("Failed to open or process .rst:", error);
    }
  };



  return (
    <FormProvider {...methods}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
          <div className="d-flex gap-2">

            <Button
              variant="primary"
              onClick={openExistingProject}
            >
              Open Project
            </Button>

            <Button
              variant="secondary"
              onClick={openRst}
            >
              Open .rst
            </Button>

            <Button
              variant="success"
              onClick={handleSave}
              disabled={!fileHandle}
              style={{
                opacity: !fileHandle ? 0.5 : 1,
                cursor: !fileHandle ? "not-allowed" : "pointer",
              }}
            >
              Save
            </Button>

            <Button
              variant="success"
              onClick={handleSaveAsNew}
              style={{
                backgroundColor: "#28a745",
                opacity: 0.85,
              }}
            >
              Save As New
            </Button>

          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">

            {/* OPTIMIZE BUTTON */}
            <Button
              variant="info"
              onClick={onOptimize}
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <span className="d-flex align-items-center gap-2">
                  <span className="spinner-border spinner-border-sm" />
                  Running...
                </span>
              ) : (
                'Optimize'
              )}
            </Button>

            {/* CANCEL BUTTON */}
            {isOptimizing && (
              <Button
                variant="danger"
                onClick={cancelOptimization}
              >
                Cancel
              </Button>
            )}

            {/* LIVE TIMER */}
            {isOptimizing && (
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: '#0d1117',
                  color: '#00ff88',
                  minWidth: '120px',
                  textAlign: 'center',
                  boxShadow: '0 0 10px rgba(0,255,136,0.25)'
                }}
              >
                ⏱ {(elapsedTime / 1000).toFixed(1)}s
              </div>
            )}

            {/* COMPLETED STATE */}
            {completed && !isOptimizing && !cancelled && (
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: '#e8f5e9',
                  color: '#1b5e20',
                  fontWeight: 600,
                  animation: 'fadeOut 5s forwards'
                }}
              >
                ✔ Done in {(totalTime / 1000).toFixed(2)}s
              </div>
            )}

            {/* CANCELLED STATE */}
            {cancelled && totalTime !== null && (
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: '#ffebee',
                  color: '#b71c1c',
                  fontWeight: 600
                }}
              >
                ✖ Cancelled after {(totalTime / 1000).toFixed(2)}s
              </div>
            )}

          </div>
        </div>



        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Primary System Data</Accordion.Header>
            <Accordion.Body>
              <PrimarySystemData
                control={methods.control}
                setValue={methods.setValue}
              />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Neutralizer Data</Accordion.Header>
            <Accordion.Body>
              <NeutralizerData
                control={methods.control}
                errors={methods.errors}
                getValues={methods.getValues}
                setValue={methods.setValue}
                clearErrors={methods.clearErrors}
              />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Calculation Parameters</Accordion.Header>
            <Accordion.Body>
              <CalculationParameters
                control={methods.control}
                errors={methods.formState.errors}
              />
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>Results</Accordion.Header>
            <Accordion.Body>
              <Results optimizationResult={optimizationResult} control={methods.control} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Container>
    </FormProvider>
  );
};

export default NeutralizerOptimization;
