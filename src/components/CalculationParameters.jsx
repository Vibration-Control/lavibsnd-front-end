import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Row, Col } from 'react-bootstrap';

const CalculationParameters = ({ control, errors }) => {
  const rules = {
    required: 'This field is required',
    pattern: {
      value: /^-?\d*\.?\d+$/,
      message: 'Please enter a valid number',
    },
  };

  const parseValue = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? '' : parsed;
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="any"
                    placeholder="e.g., 10.5"
                    className="rounded"
                    onChange={(e) => field.onChange(parseValue(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="any"
                    placeholder="e.g., 50.0"
                    className="rounded"
                    onChange={(e) => field.onChange(parseValue(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="1"
                    placeholder="e.g., 5"
                    className="rounded"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="1"
                    placeholder="e.g., 3"
                    className="rounded"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="1"
                    placeholder="e.g., 2"
                    className="rounded"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="any"
                    placeholder="e.g., 10.5"
                    className="rounded"
                    onChange={(e) => field.onChange(parseValue(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="any"
                    placeholder="e.g., 50.0"
                    className="rounded"
                    onChange={(e) => field.onChange(parseValue(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="1"
                    placeholder="e.g., 5"
                    className="rounded"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="1"
                    placeholder="e.g., 3"
                    className="rounded"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
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
                  <Form.Control
                    {...field}
                    type="number"
                    step="1"
                    placeholder="e.g., 2"
                    className="rounded"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
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
        {[
          { name: 'geneticAlgorithm.populationSize', label: 'Population Size' },
          { name: 'geneticAlgorithm.generations', label: 'Generations' },
          { name: 'geneticAlgorithm.crossover', label: 'Crossover' },
          { name: 'geneticAlgorithm.mutation', label: 'Mutation' },
        ].map(({ name, label }) => (
          <Col key={name}>
            <Form.Group controlId={name}>
              <Form.Label>{label}</Form.Label>
              <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <Form.Control
                      {...field}
                      type="number"
                      step="1"
                      placeholder={`e.g., ${label === 'Mutation' ? '5' : '100'}`}
                      className="rounded"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                    {errors.geneticAlgorithm?.[name.split('.')[1]] && (
                      <Form.Text className="text-danger">
                        {errors.geneticAlgorithm[name.split('.')[1]].message}
                      </Form.Text>
                    )}
                  </>
                )}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>
    </Form>
  );
};

export default CalculationParameters;
