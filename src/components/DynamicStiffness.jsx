import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const DynamicStiffness = () => {
  const [rows, setRows] = useState([]);
  const [plottedRows, setPlottedRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const generateUniqueId = () => Date.now() + Math.random();

  // Add new row function
  const addDynamicStiffness = () => {
    const newRow = {
      id: generateUniqueId(),
      stiffnessName: '',
      dynamicStiffnessArray: '',
      isPlotted: false,
    };
    setRows([...rows, newRow]);
  };

  const handleInputChange = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const togglePlot = (id) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        row.isPlotted = !row.isPlotted;
        if (row.isPlotted) {
          const parsedArray = parseComplexArray(row.dynamicStiffnessArray);
          setPlottedRows([...plottedRows, { id, data: parsedArray }]);
        } else {
          setPlottedRows(plottedRows.filter(rowData => rowData.id !== id));
        }
      }
      return row;
    }));
  };

  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const parseComplexArray = (complexStr) => {
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
    setRows(rows.filter(row => !selectedRows.includes(row.id)));
    setPlottedRows(plottedRows.filter(rowData => !selectedRows.includes(rowData.id)));
    setSelectedRows([]);
  };

  const chartDataReal = {
    labels: plottedRows[0]?.data.map((_, index) => index), // X-axis (index of the array)
    datasets: plottedRows.map(rowData => ({
      label: `Real Part - ${rows.find(r => r.id === rowData.id).stiffnessName}`,
      data: rowData.data.map(item => item.real),
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    })),
  };

  const chartDataImag = {
    labels: plottedRows[0]?.data.map((_, index) => index), // X-axis (index of the array)
    datasets: plottedRows.map(rowData => ({
      label: `Imaginary Part - ${rows.find(r => r.id === rowData.id).stiffnessName}`,
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
        <Button variant="primary" onClick={addDynamicStiffness}>Add Dynamic Stiffness</Button>
        <Button
          variant="danger"
          disabled={selectedRows.length === 0}
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
          {rows.map((row) => (
            <tr key={row.id}>
              {/* Select Checkbox */}
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </td>
              {/* Stiffness Name */}
              <td>
                <Form.Control
                  type="text"
                  value={row.stiffnessName}
                  onChange={(e) => handleInputChange(row.id, 'stiffnessName', e.target.value)}
                  placeholder="Enter stiffness name"
                />
              </td>
              {/* Dynamic Stiffness Array */}
              <td>
                <Form.Control
                  type="text"
                  value={row.dynamicStiffnessArray}
                  onChange={(e) => handleInputChange(row.id, 'dynamicStiffnessArray', e.target.value)}
                  placeholder="[1+2i, 3+4i, 5+6i]"
                />
              </td>
              {/* Plot/Remove Plot Button */}
              <td>
                <Button
                  variant={row.isPlotted ? 'danger' : 'success'}
                  onClick={() => togglePlot(row.id)}
                >
                  {row.isPlotted ? 'Remove Plot' : 'Plot'}
                </Button>
              </td>
            </tr>
          ))}
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
