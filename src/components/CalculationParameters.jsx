import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Row, Col, Button } from 'react-bootstrap';

const CalculationParameters = ({ control, errors }) => {

  const rules = {
    required: 'This field is required',
    pattern: {
      value: /^\d+(\.\d+)?$/,
      message: 'Please enter a valid number'
    }
  }

  return (
    <Form>
      <h5>Optimization</h5>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="frequencyLowerBoundOpt">
            <Form.Label>Frequency Lower Bound</Form.Label>
            <Controller
              name="calculationParameters.frequencyLowerBoundOpt"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 10.5"
                    className="rounded"
                  />
                  {errors.calculationParameters?.frequencyLowerBoundOpt && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.frequencyLowerBoundOpt.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyUpperBoundOpt">
            <Form.Label>Frequency Upper Bound</Form.Label>
            <Controller
              name="calculationParameters.frequencyUpperBoundOpt"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 50.0"
                    className="rounded"
                  />
                  {errors.calculationParameters?.frequencyUpperBoundOpt && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.frequencyUpperBoundOpt.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyDiscretizationOpt">
            <Form.Label>Frequency Discretization</Form.Label>
            <Controller
              name="calculationParameters.frequencyDiscretizationOpt"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 5"
                    className="rounded"
                  />
                  {errors.calculationParameters?.frequencyDiscretizationOpt && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.frequencyDiscretizationOpt.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="excitationPointOpt">
            <Form.Label>Excitation Point</Form.Label>
            <Controller
              name="calculationParameters.excitationPointOpt"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 3"
                    className="rounded"
                  />
                  {errors.calculationParameters?.excitationPointOpt && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.excitationPointOpt.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="responsePointOpt">
            <Form.Label>Response Point</Form.Label>
            <Controller
              name="calculationParameters.responsePointOpt"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 2"
                    className="rounded"
                  />
                  {errors.calculationParameters?.responsePointOpt && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.responsePointOpt.message}
                    </Form.Text>
                  )}
                </>
              )}
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
            <Controller
              name="calculationParameters.frequencyLowerBoundPlot"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 10.5"
                    className="rounded"
                  />
                  {errors.calculationParameters?.frequencyLowerBoundPlot && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.frequencyLowerBoundPlot.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyUpperBoundPlot">
            <Form.Label>Frequency Upper Bound</Form.Label>
            <Controller
              name="calculationParameters.frequencyUpperBoundPlot"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 50.0"
                    className="rounded"
                  />
                  {errors.calculationParameters?.frequencyUpperBoundPlot && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.frequencyUpperBoundPlot.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="frequencyDiscretizationPlot">
            <Form.Label>Frequency Discretization</Form.Label>
            <Controller
              name="calculationParameters.frequencyDiscretizationPlot"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 5"
                    className="rounded"
                  />
                  {errors.calculationParameters?.frequencyDiscretizationPlot && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.frequencyDiscretizationPlot.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group controlId="excitationPointPlot">
            <Form.Label>Excitation Point</Form.Label>
            <Controller
              name="calculationParameters.excitationPointPlot"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 3"
                    className="rounded"
                  />
                  {errors.calculationParameters?.excitationPointPlot && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.excitationPointPlot.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="responsePointPlot">
            <Form.Label>Response Point</Form.Label>
            <Controller
              name="calculationParameters.responsePointPlot"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 2"
                    className="rounded"
                  />
                  {errors.calculationParameters?.responsePointPlot && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.responsePointPlot.message}
                    </Form.Text>
                  )}
                </>
              )}
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
            <Controller
              name="calculationParameters.populationSize"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 100"
                    className="rounded"
                  />
                  {errors.calculationParameters?.populationSize && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.populationSize.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="generations">
            <Form.Label>Generations</Form.Label>
            <Controller
              name="calculationParameters.generations"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 50"
                    className="rounded"
                  />
                  {errors.calculationParameters?.generations && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.generations.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="crossover">
            <Form.Label>Crossover</Form.Label>
            <Controller
              name="calculationParameters.crossover"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="text"
                    placeholder="e.g., 20"
                    className="rounded"
                  />
                  {errors.calculationParameters?.crossover && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.crossover.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="mutation">
            <Form.Label>Mutation</Form.Label>
            <Controller
              name="calculationParameters.mutation"
              control={control}
              rules={rules}
              render={({ field }) => (
                <>
                  <Form.Control
                    {...field}
                    type="number"
                    placeholder="e.g., 5"
                    className="rounded"
                  />
                  {errors.calculationParameters?.mutation && (
                    <Form.Text className="text-danger">
                      {errors.calculationParameters.mutation.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default CalculationParameters;
