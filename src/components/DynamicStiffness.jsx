import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

import ArrayInputControl from '../atom/ArrayInputControl';

const DynamicStiffness = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalParameters.userDefinedDynamicStiffnesses'
  });

  const rowsWatcher = useWatch({
    control,
    name: 'additionalParameters.userDefinedDynamicStiffnesses'
  });

  const [plottedRows, setPlottedRows] = useState([]);
  const [plotError, setPlotError] = useState('');

  const createEmptyDynamicStiffness = () => ({
    name: '',
    frequencyOnMeasurement: [],
    realDynamicStiffness: [],
    imaginaryDynamicStiffness: [],
    checked: false
  });

  const isRowPlotted = (rowId) => {
    return plottedRows.some((rowData) => rowData.id === rowId);
  };

  /**
   * Converts a value into a numeric array.
   *
   * ArrayInputControl should normally already provide an array,
   * but this also handles strings just in case.
   */
  const parseNumericArray = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => Number(item))
        .filter((item) => !Number.isNaN(item));
    }

    if (typeof value === 'string') {
      const cleanedValue = value
        .replace(/[\[\]]/g, '')
        .trim();

      if (!cleanedValue) {
        return [];
      }

      return cleanedValue
        .split(',')
        .map((item) => Number(item.trim()))
        .filter((item) => !Number.isNaN(item));
    }

    return [];
  };

  /**
   * Plots or removes a dynamic stiffness curve.
   */
  const togglePlot = (rowId) => {
    setPlotError('');

    const isCurrentlyPlotted = isRowPlotted(rowId);

    // Remove from plot
    if (isCurrentlyPlotted) {
      setPlottedRows((prev) =>
        prev.filter((rowData) => rowData.id !== rowId)
      );

      return;
    }

    const index = fields.findIndex((row) => row.id === rowId);

    if (index === -1) {
      return;
    }

    const row = rowsWatcher?.[index];

    if (!row) {
      return;
    }

    const frequencies = parseNumericArray(row.frequencyOnMeasurement);
    const realDynamicStiffness = parseNumericArray(
      row.realDynamicStiffness
    );
    const imaginaryDynamicStiffness = parseNumericArray(
      row.imaginaryDynamicStiffness
    );

    /**
     * All three arrays must contain the same number of values.
     */
    const sameLength =
      frequencies.length === realDynamicStiffness.length &&
      frequencies.length === imaginaryDynamicStiffness.length;

    if (!sameLength) {
      setPlotError(
        `Cannot plot "${row.name || 'Dynamic Stiffness'}": ` +
        `the three arrays must have the same length. ` +
        `Frequency: ${frequencies.length}, ` +
        `Real: ${realDynamicStiffness.length}, ` +
        `Imaginary: ${imaginaryDynamicStiffness.length}.`
      );

      return;
    }

    if (frequencies.length === 0) {
      setPlotError(
        `Cannot plot "${row.name || 'Dynamic Stiffness'}": ` +
        'the arrays must contain at least one value.'
      );

      return;
    }

    /**
     * Build a combined representation for plotting.
     *
     * Example:
     *
     * frequencyOnMeasurement = [1, 2, 3]
     * realDynamicStiffness   = [4, 5, 6]
     * imaginaryDynamicStiffness = [7, 8, 9]
     *
     * becomes:
     *
     * [
     *   { frequency: 1, real: 4, imag: 7 },
     *   { frequency: 2, real: 5, imag: 8 },
     *   { frequency: 3, real: 6, imag: 9 }
     * ]
     */
    const fullArray = frequencies.map((frequency, arrayIndex) => ({
      frequency,
      real: realDynamicStiffness[arrayIndex],
      imag: imaginaryDynamicStiffness[arrayIndex]
    }));

    setPlottedRows((prev) => [
      ...prev,
      {
        id: rowId,
        name: row.name || 'Dynamic Stiffness',
        data: fullArray
      }
    ]);
  };

  const removeSelectedRows = () => {
    const currentDynamicStiffnesses = rowsWatcher || [];

    const indexesToRemove = currentDynamicStiffnesses
      .map((row, index) => (row?.checked ? index : -1))
      .filter((index) => index !== -1)
      .sort((a, b) => b - a);

    indexesToRemove.forEach((index) => {
      const id = fields[index].id;

      remove(index);

      if (isRowPlotted(id)) {
        setPlottedRows((prev) =>
          prev.filter((rowData) => rowData.id !== id)
        );
      }
    });
  };

  /**
   * Real part chart.
   */
  const chartDataReal = {
    datasets: plottedRows.map((rowData) => ({
      label: `Real Part - ${rowData.name}`,
      data: rowData.data.map((point) => ({
        x: point.frequency,
        y: point.real
      })),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
      tension: 0.1
    }))
  };

  /**
   * Imaginary part chart.
   */
  const chartDataImag = {
    datasets: plottedRows.map((rowData) => ({
      label: `Imaginary Part - ${rowData.name}`,
      data: rowData.data.map((point) => ({
        x: point.frequency,
        y: point.imag
      })),
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
      tension: 0.1
    }))
  };

  const chartOptions = {
    responsive: true,
    parsing: false,
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Frequency'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Dynamic Stiffness'
        }
      }
    }
  };

  return (
    <div>
      <h5>Dynamic Stiffness</h5>

      <div className="d-flex justify-content-between mb-3">
        <Button
          variant="primary"
          onClick={() => append(createEmptyDynamicStiffness())}
        >
          Add Dynamic Stiffness
        </Button>

        <Button
          variant="danger"
          disabled={!rowsWatcher?.some((row) => row.checked)}
          onClick={removeSelectedRows}
        >
          Remove Selected Rows
        </Button>
      </div>

      {plotError && (
        <Form.Text className="text-danger d-block mb-3">
          {plotError}
        </Form.Text>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Stiffness Name</th>
            <th>Frequency on Measurement</th>
            <th>Dynamic Stiffness - Real</th>
            <th>Dynamic Stiffness - Imaginary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {fields.map((row, index) => {
            const isPlotted = isRowPlotted(row.id);

            return (
              <tr key={row.id}>
                {/* Select Checkbox */}
                <td>
                  <Controller
                    name={`additionalParameters.userDefinedDynamicStiffnesses.${index}.checked`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Form.Check
                        {...field}
                        checked={field.value}
                      />
                    )}
                  />
                </td>

                {/* Stiffness Name */}
                <td>
                  <Controller
                    name={`additionalParameters.userDefinedDynamicStiffnesses.${index}.name`}
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="text"
                          placeholder="Enter Dynamic Stiffness name"
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

                {/* Frequency on Measurement */}
                <td>
                  <Controller
                    name={`additionalParameters.userDefinedDynamicStiffnesses.${index}.frequencyOnMeasurement`}
                    control={control}
                    defaultValue={[]}
                    render={({ field, fieldState }) => (
                      <>
                        <ArrayInputControl
                          {...field}
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

                {/* Real Dynamic Stiffness */}
                <td>
                  <Controller
                    name={`additionalParameters.userDefinedDynamicStiffnesses.${index}.realDynamicStiffness`}
                    control={control}
                    defaultValue={[]}
                    render={({ field, fieldState }) => (
                      <>
                        <ArrayInputControl
                          {...field}
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

                {/* Imaginary Dynamic Stiffness */}
                <td>
                  <Controller
                    name={`additionalParameters.userDefinedDynamicStiffnesses.${index}.imaginaryDynamicStiffness`}
                    control={control}
                    defaultValue={[]}
                    render={({ field, fieldState }) => (
                      <>
                        <ArrayInputControl
                          {...field}
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

                {/* Plot / Remove Plot */}
                <td>
                  <Button
                    variant={isPlotted ? 'danger' : 'success'}
                    onClick={() => togglePlot(row.id)}
                  >
                    {isPlotted ? 'Remove Plot' : 'Plot'}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {plottedRows.length > 0 && (
        <div className="d-flex">
          <div style={{ width: '50%' }}>
            <h6>Real Part Chart</h6>
            <Line
              data={chartDataReal}
              options={chartOptions}
            />
          </div>

          <div style={{ width: '50%' }}>
            <h6>Imaginary Part Chart</h6>
            <Line
              data={chartDataImag}
              options={chartOptions}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicStiffness;