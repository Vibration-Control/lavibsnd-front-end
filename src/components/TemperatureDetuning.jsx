import React, { useState } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Table, Button, Form } from 'react-bootstrap';

const TemperatureDetuning = ({ control, setValue }) => {
  // Local state for selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Watch the array from the form
  const temperatures = useWatch({
    control,
    name: 'additionalParameters.temperatureDetuning',
  }) || [];

  const { append, remove } = useFieldArray({
    control,
    name: 'additionalParameters.temperatureDetuning',
  });

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

  const appendEmptyRow = () => {
    append('');
  };

  const removeSelectedTemperatures = () => {
    [...selectedRows]
      .sort((a, b) => b - a)
      .forEach((index) => remove(index));
    setSelectedRows([]);
  };

  const toggleRowSelection = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div>
      <h5>Temperature Detuning</h5>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={appendEmptyRow}>
          Add Temperature
        </Button>
        <Button
          variant="danger"
          disabled={selectedRows.length === 0}
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
          {temperatures.map((value, index) => (
            <tr key={index}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => toggleRowSelection(index)}
                />
              </td>
              <td>
                <Controller
                  name={`additionalParameters.temperatureDetuning.${index}`}
                  control={control}
                  rules={rules}
                  defaultValue={value || ''}
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
                <Button
                  variant="danger"
                  onClick={() => {
                    remove(index);
                    setSelectedRows((prev) => prev.filter((i) => i !== index));
                  }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TemperatureDetuning;
