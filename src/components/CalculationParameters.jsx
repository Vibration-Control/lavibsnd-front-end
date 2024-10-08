import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CalculationParameters = () => {
  const [frequencyLowerBoundOpt, setFrequencyLowerBoundOpt] = useState('');
  const [frequencyUpperBoundOpt, setFrequencyUpperBoundOpt] = useState('');
  const [frequencyDiscretizationOpt, setFrequencyDiscretizationOpt] = useState('');
  const [excitationPointOpt, setExcitationPointOpt] = useState('');
  const [responsePointOpt, setResponsePointOpt] = useState('');

  const [frequencyLowerBoundPlot, setFrequencyLowerBoundPlot] = useState('');
  const [frequencyUpperBoundPlot, setFrequencyUpperBoundPlot] = useState('');
  const [frequencyDiscretizationPlot, setFrequencyDiscretizationPlot] = useState('');
  const [excitationPointPlot, setExcitationPointPlot] = useState('');
  const [responsePointPlot, setResponsePointPlot] = useState('');

  const [populationSize, setPopulationSize] = useState('');
  const [generations, setGenerations] = useState('');
  const [crossover, setCrossover] = useState('');
  const [mutation, setMutation] = useState('');

  return (
    <Form>
      <h5>Optimization</h5>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="frequencyLowerBoundOpt">
            <Form.Label>Frequency Lower Bound</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 10.5"
              value={frequencyLowerBoundOpt}
              onChange={(e) => setFrequencyLowerBoundOpt(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyUpperBoundOpt">
            <Form.Label>Frequency Upper Bound</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 50.0"
              value={frequencyUpperBoundOpt}
              onChange={(e) => setFrequencyUpperBoundOpt(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyDiscretizationOpt">
            <Form.Label>Frequency Discretization</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 5"
              value={frequencyDiscretizationOpt}
              onChange={(e) => setFrequencyDiscretizationOpt(e.target.value)}
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
              type="number"
              placeholder="e.g., 3"
              value={excitationPointOpt}
              onChange={(e) => setExcitationPointOpt(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="responsePointOpt">
            <Form.Label>Response Point</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 2"
              value={responsePointOpt}
              onChange={(e) => setResponsePointOpt(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="my-4" /> {/* Adding spacing between sections */}

      <h5>Plot</h5>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="frequencyLowerBoundPlot">
            <Form.Label>Frequency Lower Bound</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 10.5"
              value={frequencyLowerBoundPlot}
              onChange={(e) => setFrequencyLowerBoundPlot(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyUpperBoundPlot">
            <Form.Label>Frequency Upper Bound</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 50.0"
              value={frequencyUpperBoundPlot}
              onChange={(e) => setFrequencyUpperBoundPlot(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyDiscretizationPlot">
            <Form.Label>Frequency Discretization</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 5"
              value={frequencyDiscretizationPlot}
              onChange={(e) => setFrequencyDiscretizationPlot(e.target.value)}
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
              type="number"
              placeholder="e.g., 3"
              value={excitationPointPlot}
              onChange={(e) => setExcitationPointPlot(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="responsePointPlot">
            <Form.Label>Response Point</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 2"
              value={responsePointPlot}
              onChange={(e) => setResponsePointPlot(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
      </Row>

      <div className="my-4" /> {/* Adding spacing between sections */}

      <h5>Genetic Algorithm</h5>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="populationSize">
            <Form.Label>Population Size</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 100"
              value={populationSize}
              onChange={(e) => setPopulationSize(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="generations">
            <Form.Label>Generations</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 50"
              value={generations}
              onChange={(e) => setGenerations(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="crossover">
            <Form.Label>Crossover</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 20"
              value={crossover}
              onChange={(e) => setCrossover(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="mutation">
            <Form.Label>Mutation</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 5"
              value={mutation}
              onChange={(e) => setMutation(e.target.value)}
              className="rounded"
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default CalculationParameters;
