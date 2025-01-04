import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const PrimarySystemData = ({ formData, handleInputChange }) => {
  const [rows, setRows] = useState([]);

  const generateUniqueId = () => `${Date.now()}-${Math.random()}`;

  const addRow = () => {
    const newRow = {
      id: generateUniqueId(),
      naturalFrequency: '',
      modalDamping: '',
      mode: [],
      selected: false,
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
  };

  const handleRowChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            [field]: field === 'mode' ? tryParseArray(value) : tryParseFloat(value),
          }
        : row
    );
    setRows(updatedRows);
  };

  const tryParseFloat = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? '' : parsed;
  };

  const tryParseArray = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  const removeSelectedRows = () => {
    const updatedRows = rows.filter((row) => !row.selected);
    setRows(updatedRows);
  };

  const toggleRowSelection = (id) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, selected: !row.selected } : row
    );
    setRows(updatedRows);
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={addRow}>
          Add Row
        </Button>
        <Button
          variant="danger"
          onClick={removeSelectedRows}
          disabled={!rows.some((row) => row.selected)}
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
                  checked={row.selected}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.naturalFrequency}
                  onChange={(e) =>
                    handleRowChange(row.id, 'naturalFrequency', e.target.value)
                  }
                  placeholder="e.g. 1.0"
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.modalDamping}
                  onChange={(e) =>
                    handleRowChange(row.id, 'modalDamping', e.target.value)
                  }
                  placeholder="e.g. 0.05"
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={JSON.stringify(row.mode)}
                  onChange={(e) => handleRowChange(row.id, 'mode', e.target.value)}
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
