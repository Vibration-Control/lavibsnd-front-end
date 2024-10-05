import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const NeutralizerData = () => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const generateUniqueId = () => Date.now() + Math.random();

  // Function to handle adding a new neutralizer row
  const addNeutralizer = () => {
    const newRow = {
      id: generateUniqueId(),
      neutralizerType: [],
      modalPosition: '',
      naturalFreqLower: '',
      naturalFreqUpper: '',
      dampingRatioLower: '',
      dampingRatioUpper: '',
      viscoelasticMaterial: '',
      dynamicStiffness: '',
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

  const removeNeutralizers = () => {
    setRows(rows.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]); // Clear selection after deletion
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={addNeutralizer}>Add Neutralizer</Button>
        <Button
          variant="danger"
          disabled={selectedRows.length === 0}
          onClick={removeNeutralizers}
        >
          Remove Neutralizers
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Neutralizer Type</th>
            <th>Modal Position</th>
            <th>Natural Frequency Lower Bound</th>
            <th>Natural Frequency Upper Bound</th>
            <th>Damping Ratio Lower Bound</th>
            <th>Damping Ratio Upper Bound</th>
            <th>Viscoelastic Material</th>
            <th>Dynamic Stiffness</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => toggleRowSelection(row.id)}
                />
              </td>
              {/* Neutralizer Type */}
              <td>
                <Form.Control
                  as="select"
                  value={row.neutralizerType}
                  onChange={(e) => handleInputChange(row.id, 'neutralizerType', [...e.target.selectedOptions].map(o => o.value))}
                  multiple
                >
                  <option value="0">Type 0</option>
                  <option value="1">Type 1</option>
                  <option value="2">Type 2</option>
                  {/* Add more types as needed */}
                </Form.Control>
              </td>
              {/* Modal Position */}
              <td>
                <Form.Control
                  type="text"
                  value={row.modalPosition}
                  onChange={(e) => handleInputChange(row.id, 'modalPosition', e.target.value)}
                  placeholder="[0,1,4,7]"
                />
              </td>
              {/* Natural Frequency Lower Bound */}
              <td>
                <Form.Control
                  type="number"
                  value={row.naturalFreqLower}
                  onChange={(e) => handleInputChange(row.id, 'naturalFreqLower', e.target.value)}
                />
              </td>
              {/* Natural Frequency Upper Bound */}
              <td>
                <Form.Control
                  type="number"
                  value={row.naturalFreqUpper}
                  onChange={(e) => handleInputChange(row.id, 'naturalFreqUpper', e.target.value)}
                />
              </td>
              {/* Damping Ratio Lower Bound - enabled only if type contains 1 */}
              <td>
                <Form.Control
                  type="number"
                  value={row.dampingRatioLower}
                  onChange={(e) => handleInputChange(row.id, 'dampingRatioLower', e.target.value)}
                  disabled={!row.neutralizerType.includes('1')}
                />
              </td>
              {/* Damping Ratio Upper Bound - enabled only if type contains 1 */}
              <td>
                <Form.Control
                  type="number"
                  value={row.dampingRatioUpper}
                  onChange={(e) => handleInputChange(row.id, 'dampingRatioUpper', e.target.value)}
                  disabled={!row.neutralizerType.includes('1')}
                />
              </td>
              {/* Viscoelastic Material - array input enabled only if type contains 2 */}
              <td>
                <Form.Control
                  type="text"
                  value={row.viscoelasticMaterial}
                  onChange={(e) => handleInputChange(row.id, 'viscoelasticMaterial', e.target.value)}
                  placeholder="[Material1, Material2]"
                  disabled={!row.neutralizerType.includes('2')}
                />
              </td>
              {/* Dynamic Stiffness - enabled only if type contains 0 */}
              <td>
                <Form.Control
                  type="text"
                  value={row.dynamicStiffness}
                  onChange={(e) => handleInputChange(row.id, 'dynamicStiffness', e.target.value)}
                  placeholder="[Stiffness1, Stiffness2]"
                  disabled={!row.neutralizerType.includes('0')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default NeutralizerData;
