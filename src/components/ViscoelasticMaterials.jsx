import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const ViscoelasticMaterial = () => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const generateUniqueId = () => Date.now() + Math.random();

  // Add new row function
  const addViscoelasticMaterial = () => {
    const newRow = {
      id: generateUniqueId(),
      workingTemperature: '',
      referenceTemperature: '',
      lowerShearModulus: '',
      upperShearModulus: '',
      fractionalDerivativeParameter: '',
      temperatureShiftingFactor: '',
      teta1: '',
      teta2: '',
    };
    setRows([...rows, newRow]);
  };

  const handleInputChange = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const removeSelectedRows = () => {
    setRows(rows.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]);
  };

  return (
    <div>
      <h5>Viscoelastic Material</h5>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={addViscoelasticMaterial}>Add Viscoelastic Material</Button>
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
            <th>Working Temperature</th>
            <th>Reference Temperature</th>
            <th>Lower Shear Modulus</th>
            <th>Upper Shear Modulus</th>
            <th>Fractional Derivative Parameter</th>
            <th>Temperature Shifting Factor</th>
            <th>Teta 1</th>
            <th>Teta 2</th>
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
              {/* Working Temperature */}
              <td>
                <Form.Control
                  type="number"
                  value={row.workingTemperature}
                  onChange={(e) => handleInputChange(row.id, 'workingTemperature', e.target.value)}
                  placeholder="Enter working temperature"
                />
              </td>
              {/* Reference Temperature */}
              <td>
                <Form.Control
                  type="number"
                  value={row.referenceTemperature}
                  onChange={(e) => handleInputChange(row.id, 'referenceTemperature', e.target.value)}
                  placeholder="Enter reference temperature"
                />
              </td>
              {/* Lower Shear Modulus */}
              <td>
                <Form.Control
                  type="number"
                  value={row.lowerShearModulus}
                  onChange={(e) => handleInputChange(row.id, 'lowerShearModulus', e.target.value)}
                  placeholder="Enter lower shear modulus"
                />
              </td>
              {/* Upper Shear Modulus */}
              <td>
                <Form.Control
                  type="number"
                  value={row.upperShearModulus}
                  onChange={(e) => handleInputChange(row.id, 'upperShearModulus', e.target.value)}
                  placeholder="Enter upper shear modulus"
                />
              </td>
              {/* Fractional Derivative Parameter */}
              <td>
                <Form.Control
                  type="number"
                  value={row.fractionalDerivativeParameter}
                  onChange={(e) => handleInputChange(row.id, 'fractionalDerivativeParameter', e.target.value)}
                  placeholder="Enter fractional derivative parameter"
                />
              </td>
              {/* Temperature Shifting Factor */}
              <td>
                <Form.Control
                  type="number"
                  value={row.temperatureShiftingFactor}
                  onChange={(e) => handleInputChange(row.id, 'temperatureShiftingFactor', e.target.value)}
                  placeholder="Enter temperature shifting factor"
                />
              </td>
              {/* Teta 1 */}
              <td>
                <Form.Control
                  type="number"
                  value={row.teta1}
                  onChange={(e) => handleInputChange(row.id, 'teta1', e.target.value)}
                  placeholder="Enter Teta 1"
                />
              </td>
              {/* Teta 2 */}
              <td>
                <Form.Control
                  type="number"
                  value={row.teta2}
                  onChange={(e) => handleInputChange(row.id, 'teta2', e.target.value)}
                  placeholder="Enter Teta 2"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ViscoelasticMaterial;
