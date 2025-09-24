import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const DynamicStiffness = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additionalParameters.userDefinedDynamicStiffnesses'
  })
  const rowsWatcher = useWatch({ control, name: 'additionalParameters.userDefinedDynamicStiffnesses' })
  
  const [plottedRows, setPlottedRows] = useState([]);
  
  const createEmptyDynamicStiffness = () => ({
    name: '',
    range: '',
  });

  const isRowPlotted = (rowId) => {
    return plottedRows.some(rowData => rowData.id === rowId);
  }

  const togglePlot = (rowId) => {
    const isCurrentlyPlotted = isRowPlotted(rowId)
    const index = fields.findIndex(row => row.id === rowId);

    if (!isCurrentlyPlotted) {
      const parsedArray = parseComplexArray(rowsWatcher[index].range);
      setPlottedRows(prev => [...prev, { id: rowId, data: parsedArray, name: rowsWatcher[index].name  }]);
    } else {
      setPlottedRows(prev => prev.filter(rowData => rowData.id !== rowId));
    }
  }

  const parseComplexArray = (complexStr) => {
    if (Array.isArray(complexStr)) {
      complexStr = complexStr.join(", ")
    }
    
    return complexStr.replace(/[\[\]]/g, '')
      .split(',')
      .map((str) => {
        const parts = str.trim().split(/[+i]/);
        return {
          real: parseFloat(parts[0]),
          imag: parseFloat(parts[1]),
        };
      });
  };

  const removeSelectedRows = () => {
    const currentDynamicStiffnesses = (rowsWatcher || [])

    const indexesToRemove = currentDynamicStiffnesses
			.map((row, index) => (row?.checked ? index : -1))
			.filter(index => index !== -1)
			.sort((a, b) => b - a);

		indexesToRemove.forEach(index => {
      const id = fields[index].id

      remove(index)
      if (isRowPlotted(id)) {
        setPlottedRows(prev => prev.filter(rowData => rowData.id !== id))
      }
    })
  }

  const chartDataReal = {
    labels: plottedRows[0]?.data.map((_, index) => index), // X-axis (index of the array)
    datasets: plottedRows.map((rowData, index) => ({
      label: `Real Part - ${plottedRows[index].name}`,
      data: rowData.data.map(item => item.real),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    })),
  };

  const chartDataImag = {
    labels: plottedRows[0]?.data.map((_, index) => index), // X-axis (index of the array)
    datasets: plottedRows.map((rowData, index) => ({
      label: `Imaginary Part - ${plottedRows[index].name}`,
      data: rowData.data.map(item => item.imag),
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: true,
    })),
  };

  return (
    <div>
      <h5>Dynamic Stiffness</h5>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => append(createEmptyDynamicStiffness())}>Add Dynamic Stiffness</Button> 
        <Button
          variant="danger"
					disabled={!rowsWatcher?.some((row) => row.checked)}
          onClick={removeSelectedRows}
        >
          Remove Selected Rows
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Stiffness Name</th>
            <th>Dynamic Stiffness Array (complex)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((row, index) => {
            const isPlotted = isRowPlotted(row.id)
            
            return(
              <tr key={row.id}>
                {/* Select Checkbox */}
                <td>
                  <Controller
                    name={`additionalParameters.userDefinedDynamicStiffnesses.${index}.checked`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => <Form.Check {...field} checked={field.value} />}
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
                {/* Dynamic Stiffness Array */}
                <td>
                  <Controller 
                    name={`additionalParameters.userDefinedDynamicStiffnesses.${index}.range`}
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control 
                          {...field}
                          type='text'
                          placeholder="[1+2i, 3+4i, 5+6i]"
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
                {/* Plot/Remove Plot Button */}
                <td>
                  <Button
                    variant={isPlotted ? 'danger' : 'success'}
                    onClick={() => togglePlot(row.id)}
                  >
                    {isPlotted ? 'Remove Plot' : 'Plot'}
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      {/* Render the charts only if data is available */}
      {plottedRows.length > 0 && (
        <div className="d-flex">
          <div style={{ width: '50%' }}>
            <h6>Real Part Chart</h6>
            <Line data={chartDataReal} />
          </div>
          <div style={{ width: '50%' }}>
            <h6>Imaginary Part Chart</h6>
            <Line data={chartDataImag} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicStiffness;