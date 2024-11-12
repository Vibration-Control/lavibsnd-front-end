import React, { useContext } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { FormContext } from '../context/FormContext';

const CalculationParameters = () => {
  const { formData, handleInputChange } = useContext(FormContext);

  const handleInput = (field, value, isFloat = false) => {
    let parsedValue;
    if (isFloat) {
      parsedValue = parseFloat(value); // Parse as float for specific fields
    } else {
      parsedValue = parseInt(value, 10); // Parse as integer for other fields
    }

    handleInputChange('calculationParameters', {
      ...formData.calculationParameters,
      [field]: isNaN(parsedValue) ? '' : parsedValue // Set to '' if parsing fails
    });
  };

  return (
    <Form>
      <h5>Optimization</h5>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="frequencyLowerBoundOpt">
            <Form.Label>Frequency Lower Bound</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 10.5"
              value={formData.calculationParameters.frequencyLowerBoundOpt}
              onChange={(e) => handleInput('frequencyLowerBoundOpt', e.target.value, true)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyUpperBoundOpt">
            <Form.Label>Frequency Upper Bound</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 50.0"
              value={formData.calculationParameters.frequencyUpperBoundOpt}
              onChange={(e) => handleInput('frequencyUpperBoundOpt', e.target.value, true)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyDiscretizationOpt">
            <Form.Label>Frequency Discretization</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 5"
              value={formData.calculationParameters.frequencyDiscretizationOpt}
              onChange={(e) => handleInput('frequencyDiscretizationOpt', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="excitationPointOpt">
            <Form.Label>Excitation Point</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 3"
              value={formData.calculationParameters.excitationPointOpt}
              onChange={(e) => handleInput('excitationPointOpt', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="responsePointOpt">
            <Form.Label>Response Point</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 2"
              value={formData.calculationParameters.responsePointOpt}
              onChange={(e) => handleInput('responsePointOpt', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="my-4" />

      <h5>Plot</h5>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="frequencyLowerBoundPlot">
            <Form.Label>Frequency Lower Bound</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 10.5"
              value={formData.calculationParameters.frequencyLowerBoundPlot}
              onChange={(e) => handleInput('frequencyLowerBoundPlot', e.target.value, true)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyUpperBoundPlot">
            <Form.Label>Frequency Upper Bound</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 50.0"
              value={formData.calculationParameters.frequencyUpperBoundPlot}
              onChange={(e) => handleInput('frequencyUpperBoundPlot', e.target.value, true)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyDiscretizationPlot">
            <Form.Label>Frequency Discretization</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 5"
              value={formData.calculationParameters.frequencyDiscretizationPlot}
              onChange={(e) => handleInput('frequencyDiscretizationPlot', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="excitationPointPlot">
            <Form.Label>Excitation Point</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 3"
              value={formData.calculationParameters.excitationPointPlot}
              onChange={(e) => handleInput('excitationPointPlot', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="responsePointPlot">
            <Form.Label>Response Point</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 2"
              value={formData.calculationParameters.responsePointPlot}
              onChange={(e) => handleInput('responsePointPlot', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="my-4" />

      <h5>Genetic Algorithm</h5>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="populationSize">
            <Form.Label>Population Size</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 100"
              value={formData.calculationParameters.populationSize}
              onChange={(e) => handleInput('populationSize', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="generations">
            <Form.Label>Generations</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 50"
              value={formData.calculationParameters.generations}
              onChange={(e) => handleInput('generations', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="crossover">
            <Form.Label>Crossover</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 20"
              value={formData.calculationParameters.crossover}
              onChange={(e) => handleInput('crossover', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="mutation">
            <Form.Label>Mutation</Form.Label>
            <Form.Control
              type="text" // Changed to text to allow validation logic
              placeholder="e.g., 5"
              value={formData.calculationParameters.mutation}
              onChange={(e) => handleInput('mutation', e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default CalculationParameters;
