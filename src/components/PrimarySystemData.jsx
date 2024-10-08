import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const PrimarySystemData = ({ formData, handleInputChange }) => {
  const [rows, setRows] = useState([]);

  const generateUniqueId = () => Date.now() + Math.random();

  // Function to handle adding a new primary system data row
  const addRow = () => {
    const newRow = {
      id: generateUniqueId(),
      naturalFrequency: '',
      modalDamping: '',
      mode: [], // Initialize as an empty array
    };
    setRows([...rows, newRow]);
  };

  const handleInputChangeRow = (id, field, value) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        let updatedValue;
        if (field === 'naturalFrequency' || field === 'modalDamping') {
          updatedValue = parseFloat(value); // Convert to float
        } else if (field === 'mode') {
          try {
            updatedValue = JSON.parse(value); // Parse as array
          } catch (e) {
            updatedValue = []; // Handle invalid input
          }
        } else {
          updatedValue = value; // Default case
        }

        return { ...row, [field]: updatedValue }; // Return updated row directly
      }
      return row; // Return unchanged row
    });

    setRows(updatedRows);

    // Create the updated form data based on the updated rows
    const updatedFormData = {
      naturalFrequencies: updatedRows.map(r => r.naturalFrequency),
      modalDamping: updatedRows.map(r => r.modalDamping),
      modes: updatedRows.map(r => r.mode),
    };

    // Pass the updated form data to the parent without the key
    handleInputChange(updatedFormData);
  };

  const removeRows = () => {
    const updatedRows = rows.filter(row => !row.selected);
    setRows(updatedRows);
    handleInputChange({
      naturalFrequencies: updatedRows.map(r => r.naturalFrequency),
      modalDamping: updatedRows.map(r => r.modalDamping),
      modes: updatedRows.map(r => r.mode),
    });
  };

  const toggleRowSelection = (id) => {
    setRows(rows.map(row => row.id === id ? { ...row, selected: !row.selected } : row));
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={addRow}>Add Row</Button>
        <Button
          variant="danger"
          disabled={rows.every(row => !row.selected)}
          onClick={removeRows}
        >
          Remove Selected Rows
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Natural Frequency</th>
            <th>Modal Damping</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={row.selected || false}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </td>
              <td>
                <Form.Control
                  type="text" // Change to text to allow floats
                  value={row.naturalFrequency}
                  onChange={(e) => handleInputChangeRow(row.id, 'naturalFrequency', e.target.value)}
                  placeholder="e.g. 1.0"
                />
              </td>
              <td>
                <Form.Control
                  type="text" // Change to text to allow floats
                  value={row.modalDamping}
                  onChange={(e) => handleInputChangeRow(row.id, 'modalDamping', e.target.value)}
                  placeholder="e.g. 0.05"
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={JSON.stringify(row.mode)} // Display as a JSON string
                  onChange={(e) => handleInputChangeRow(row.id, 'mode', e.target.value)}
                  placeholder='e.g. [0, 1, 2]'
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PrimarySystemData;
