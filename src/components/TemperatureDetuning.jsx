import React, { useState } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Table, Button, Form } from 'react-bootstrap';

const TemperatureDetuning = ({ control, errors, getValues }) => {

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalParameters.temperatureDetuning',
  });

  const temperatureRows = useWatch({ control, name: 'additionalParameters.temperatureDetuning' });

  const rules = {
    required: 'This field is required',
    pattern: {
      value: /^\d+(\.\d+)?$/,
      message: 'Please enter a valid number',
    },
  };

  const parseValue = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? '' : parsed;
  };

  const createEmptyTemperature = () => ({ value: '' });

  const removeSelectedTemperatures = () => {
    const indexesToRemove = temperatureRows
      .map((row, index) => (row?.checked ? index : -1))
      .filter(index => index !== -1)
      .sort((a, b) => b - a);

    indexesToRemove.forEach(index => remove(index));
  };

  return (
    <div>
      <h5>Temperature Detuning</h5>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => append(createEmptyTemperature())}>
          Add Temperature
        </Button>
        <Button
          variant="danger"
          disabled={!temperatureRows?.some((row) => row.checked)}
          onClick={removeSelectedTemperatures}
        >
          Remove Selected
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Temperature (K)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((row, index) => (
            <tr key={row.id}>
              <td>
                <Controller
                  name={`additionalParameters.temperatureDetuning.${index}.checked`}
                  control={control}
                  defaultValue={false}
                  render={({ field }) => <Form.Check {...field} checked={field.value} />}
                />
              </td>
              <td>
                <Controller
                  name={`additionalParameters.temperatureDetuning.${index}.value`}
                  control={control}
                  rules={rules}
                  defaultValue={row.value || ''}
                  render={({ field, fieldState }) => (
                    <>
                      <Form.Control
                        {...field}
                        type="number"
                        placeholder="Enter temperature"
                        onChange={(e) => field.onChange(parseValue(e.target.value))}
                      />
                      {fieldState.error && (
                        <Form.Text className="text-danger">
                          {fieldState.error.message}
                        </Form.Text>
                      )}
                    </>
                  )}
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => remove(index)}>Remove</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TemperatureDetuning;
