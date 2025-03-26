import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import ViscoelasticMaterials from './ViscoelasticMaterials';
import DynamicStiffness from './DynamicStiffness';

const NeutralizerData = () => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const generateUniqueId = () => Date.now() + Math.random();

  const addNeutralizer = () => {
    const newRow = {
      id: generateUniqueId(),
      neutralizerType: [],
      modalPosition: '',
      naturalFreqLower: '',
      naturalFreqUpper: '',
      naturalFreqDiscretization: '',
      dampingRatioLower: '',
      dampingRatioUpper: '',
      dampingRatioDiscretization: '',
      mass: '',
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
    setSelectedRows([]);
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
            <th>Mass</th>
            <th>Neutralizer Type</th>
            <th>Modal Position</th>
            <th>Natural Frequency Lower Bound</th>
            <th>Natural Frequency Upper Bound</th>
            <th>Natural Frequency Discretization</th>
            <th>Damping Ratio Lower Bound</th>
            <th>Damping Ratio Upper Bound</th>
            <th>Damping Ratio Discretization</th>
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
              <td>
                <Form.Control
                  type="number"
                  value={row.mass}
                  onChange={(e) => handleInputChange(row.id, 'mass', e.target.value)}
                  placeholder="Mass"
                />
              </td>
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
                </Form.Control>
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.modalPosition}
                  onChange={(e) => handleInputChange(row.id, 'modalPosition', e.target.value)}
                  placeholder="[0,1,4,7]"
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.naturalFreqLower}
                  onChange={(e) => handleInputChange(row.id, 'naturalFreqLower', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.naturalFreqUpper}
                  onChange={(e) => handleInputChange(row.id, 'naturalFreqUpper', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.naturalFreqDiscretization}
                  onChange={(e) => handleInputChange(row.id, 'naturalFreqDiscretization', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.dampingRatioLower}
                  onChange={(e) => handleInputChange(row.id, 'dampingRatioLower', e.target.value)}
                  disabled={!row.neutralizerType.includes('1')}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.dampingRatioUpper}
                  onChange={(e) => handleInputChange(row.id, 'dampingRatioUpper', e.target.value)}
                  disabled={!row.neutralizerType.includes('1')}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={row.dampingRatioDiscretization}
                  onChange={(e) => handleInputChange(row.id, 'dampingRatioDiscretization', e.target.value)}
                  disabled={!row.neutralizerType.includes('1')}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.viscoelasticMaterial}
                  onChange={(e) => handleInputChange(row.id, 'viscoelasticMaterial', e.target.value)}
                  placeholder="[Material1, Material2]"
                  disabled={!row.neutralizerType.includes('2')}
                />
              </td>
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

      <ViscoelasticMaterials />
      <DynamicStiffness />
    </div>
  );
};

export default NeutralizerData;
