import React, { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Form, Row, Col } from 'react-bootstrap';

const CalculationParameters = ({ control, errors, setValue }) => {
  const rules = {
    required: 'This field is required',
    pattern: {
      value: /^-?\d*\.?\d+$/,
      message: 'Please enter a valid number',
    },
  };

  const objectiveFunctionType = Number(
    useWatch({
      control,
      name: "objectiveFunctionType",
      defaultValue: 0,
    })
  );

  const disableResponse =
    objectiveFunctionType === 0 ||
    objectiveFunctionType === 1 ||
    objectiveFunctionType === 2 ||
    objectiveFunctionType === 4;

  const disableExcitation =
    objectiveFunctionType === 2 ||
    objectiveFunctionType === 4 ||
    objectiveFunctionType === 5;

  console.log("disableExcitation")
  console.log(objectiveFunctionType)
  console.log(disableExcitation)

  useEffect(() => {
    if (disableResponse) {
      setValue("responseNodeOptimization", 0);
    }

    if (disableExcitation) {
      setValue("excitationNodeOptimization", 0);
    }
  }, [objectiveFunctionType, disableResponse, disableExcitation, setValue]);

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
        <Col md={6}>
          <Form.Group controlId="objectiveFunctionType">
            <Form.Label>Objective Function</Form.Label>
            <Controller
              name="objectiveFunctionType"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <Form.Select
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                >
                  <option value={0}>Modal coordinates (point excitation)</option>
                  <option value={1}>Modal coordinates (distributed excitation)</option>
                  <option value={2}>Modal Frobenius norm</option>
                  <option value={3}>Single FRF H(K,S)</option>
                  <option value={4}>Global FRF Frobenius norm</option>
                  <option value={5}>FRF column norm</option>
                </Form.Select>
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
                    disabled={disableExcitation}
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
                    disabled={disableResponse}
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
