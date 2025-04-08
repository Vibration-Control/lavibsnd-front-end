import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Row, Col } from 'react-bootstrap';

const CalculationParameters = ({ control, errors }) => {
  const rules = {
    required: 'This field is required',
    pattern: {
      value: /^\d+(\.\d+)?$/,
      message: 'Please enter a valid number'
    }
  };

  return (
    <Form>
      <h5>Optimization</h5>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="objectiveFunctionSearchLowerBound">
            <Form.Label>Frequency Lower Bound</Form.Label>
            <Controller
              name="objectiveFunctionSearchLowerBound"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 10.5" className="rounded" />
                  {errors.objectiveFunctionSearchLowerBound && (
                    <Form.Text className="text-danger">
                      {errors.objectiveFunctionSearchLowerBound.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="objectiveFunctionSearchUpperBound">
            <Form.Label>Frequency Upper Bound</Form.Label>
            <Controller
              name="objectiveFunctionSearchUpperBound"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 50.0" className="rounded" />
                  {errors.objectiveFunctionSearchUpperBound && (
                    <Form.Text className="text-danger">
                      {errors.objectiveFunctionSearchUpperBound.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="objectiveFunctionSearchDiscretization">
            <Form.Label>Discretization</Form.Label>
            <Controller
              name="objectiveFunctionSearchDiscretization"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 5" className="rounded" />
                  {errors.objectiveFunctionSearchDiscretization && (
                    <Form.Text className="text-danger">
                      {errors.objectiveFunctionSearchDiscretization.message}
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
          <Form.Group controlId="excitationNodeOptimization">
            <Form.Label>Excitation Point</Form.Label>
            <Controller
              name="excitationNodeOptimization"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 3" className="rounded" />
                  {errors.excitationNodeOptimization && (
                    <Form.Text className="text-danger">
                      {errors.excitationNodeOptimization.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="responseNodeOptimization">
            <Form.Label>Response Point</Form.Label>
            <Controller
              name="responseNodeOptimization"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 2" className="rounded" />
                  {errors.responseNodeOptimization && (
                    <Form.Text className="text-danger">
                      {errors.responseNodeOptimization.message}
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
          <Form.Group controlId="plotLowerBound">
            <Form.Label>Frequency Lower Bound</Form.Label>
            <Controller
              name="plotLowerBound"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 10.5" className="rounded" />
                  {errors.plotLowerBound && (
                    <Form.Text className="text-danger">
                      {errors.plotLowerBound.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="plotUpperBound">
            <Form.Label>Frequency Upper Bound</Form.Label>
            <Controller
              name="plotUpperBound"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 50.0" className="rounded" />
                  {errors.plotUpperBound && (
                    <Form.Text className="text-danger">
                      {errors.plotUpperBound.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="plotDiscretization">
            <Form.Label>Discretization</Form.Label>
            <Controller
              name="plotDiscretization"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 5" className="rounded" />
                  {errors.plotDiscretization && (
                    <Form.Text className="text-danger">
                      {errors.plotDiscretization.message}
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
          <Form.Group controlId="excitationNodePlot">
            <Form.Label>Excitation Point</Form.Label>
            <Controller
              name="excitationNodePlot"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 3" className="rounded" />
                  {errors.excitationNodePlot && (
                    <Form.Text className="text-danger">
                      {errors.excitationNodePlot.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="responseNodePlot">
            <Form.Label>Response Point</Form.Label>
            <Controller
              name="responseNodePlot"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 2" className="rounded" />
                  {errors.responseNodePlot && (
                    <Form.Text className="text-danger">
                      {errors.responseNodePlot.message}
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
          <Form.Group controlId="geneticAlgorithm.populationSize">
            <Form.Label>Population Size</Form.Label>
            <Controller
              name="geneticAlgorithm.populationSize"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 100" className="rounded" />
                  {errors.geneticAlgorithm?.populationSize && (
                    <Form.Text className="text-danger">
                      {errors.geneticAlgorithm.populationSize.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="geneticAlgorithm.generations">
            <Form.Label>Generations</Form.Label>
            <Controller
              name="geneticAlgorithm.generations"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 50" className="rounded" />
                  {errors.geneticAlgorithm?.generations && (
                    <Form.Text className="text-danger">
                      {errors.geneticAlgorithm.generations.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="geneticAlgorithm.crossover">
            <Form.Label>Crossover</Form.Label>
            <Controller
              name="geneticAlgorithm.crossover"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 20" className="rounded" />
                  {errors.geneticAlgorithm?.crossover && (
                    <Form.Text className="text-danger">
                      {errors.geneticAlgorithm.crossover.message}
                    </Form.Text>
                  )}
                </>
              )}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="geneticAlgorithm.mutation">
            <Form.Label>Mutation</Form.Label>
            <Controller
              name="geneticAlgorithm.mutation"
              control={control}
              rules={rules}
              defaultValue=""
              render={({ field }) => (
                <>
                  <Form.Control {...field} type="text" placeholder="e.g., 5" className="rounded" />
                  {errors.geneticAlgorithm?.mutation && (
                    <Form.Text className="text-danger">
                      {errors.geneticAlgorithm.mutation.message}
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
