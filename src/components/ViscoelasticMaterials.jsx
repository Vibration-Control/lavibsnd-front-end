import React, { useState } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Table, Button, Form } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import initialMaterials from '../Data/ViscoelasticMaterials.json';

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
const isothermalTemperatures = [253, 273, 293, 313, 333];

Chart.register();

const generatePowerOf10Ticks = (minPower, maxPower) => {
  const ticks = [];
  for (let i = minPower; i <= maxPower; i++) {
    ticks.push(Math.pow(10, i));
  }
  return ticks;
};

const formatPowerOf10 = (value) => {
  const exponent = Math.log10(value);
  return `10^${Math.round(exponent)}`;
};

const ViscoelasticMaterial = ({ control, errors, getValues }) => {

  const { fields, append, remove } = useFieldArray({ 
    control,
    name: 'additionalParameters.viscoelasticMaterials'
  })

  const [plottedRows, setPlottedRows] = useState([]);
  const viscoelasticMaterialRows = useWatch({ control, name: 'additionalParameters.viscoelasticMaterials' })

  const rules = {
    required: 'This field is required',
    pattern: {
      value: /^\d+(\.\d+)?$/,
      message: 'Please enter a valid number'
    }
  }

  const parseValue = (value) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? '' : parsed;
  };

  const getRulesLowerShearModulus = (rowIndex) => ({
    ...rules,
    validate: (value) => {
      const upperBound = viscoelasticMaterialRows[rowIndex].upperShearModulus
      
      if (!value || !upperBound)
        return true

      return (parseFloat(value) < parseFloat(upperBound)) 
        || 'Value must be lower than Upper Shear Modulus'
    }
  })

  const getRulesUpperShearModulus = (rowIndex) => ({
    ...rules,
    validate: (value) => {
      const lowerBound = viscoelasticMaterialRows[rowIndex].lowerShearModulus

      if (!value || !lowerBound)
          return true

      return (parseFloat(lowerBound) < parseFloat(value)) 
        || 'Value must be higher than Lower Shear Modulus'
    }
  })

  const createEmptyViscoelasticMaterial = () => ({
    checked: false,
    name: '',
    workingTemperature: '',
    referenceTemperature: '',
    lowerShearModulus: '',
    upperShearModulus: '',
    fractionalDerivativeParameter: '',
    temperatureShiftingFactor: '',
    teta1: '',
    teta2: '',
  })

  const removeSelectedViscoelasticMaterials = () => {
    const currentViscoelasticMaterialRows = (viscoelasticMaterialRows || [])

    const indexesToRemove = currentViscoelasticMaterialRows
			.map((row, index) => (row?.checked ? index : -1))
			.filter(index => index !== -1)
			.sort((a, b) => b - a);

		indexesToRemove.forEach(index => remove(index))
  }

  const togglePlot = (id) => {
    setPlottedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const calculateAlphaT = (T, row) => {
    const T0 = parseFloat(row.referenceTemperature);
    const theta1 = parseFloat(row.teta1);
    const theta2 = parseFloat(row.teta2);
    
    if ([T, T0, theta1, theta2].some(isNaN)) return NaN;
    
    const exponent = -theta1 * (T - T0) / (theta2 + (T - T0));
    return Math.pow(10, exponent);
  };

  const generateNomogramData = (row) => {
    const G0 = parseFloat(row.lowerShearModulus);
    const Ginf = parseFloat(row.upperShearModulus);
    const b = parseFloat(row.temperatureShiftingFactor);
    const alpha = parseFloat(row.fractionalDerivativeParameter);
    
    if ([G0, Ginf, b, alpha].some(isNaN)) return null;

    // Generate frequencies from 1e-10 to 1e10
    const frequencies = Array.from({ length: 200 }, (_, i) => 
      Math.pow(10, (i/200)*20 - 10)
    );

    const data = { G: [], eta: [], omega: [], isotherms: [] };

    // Generate main curves
    frequencies.forEach(f => {
      const omega = f;
      const bOmega = b * omega;
      const angle = (alpha * Math.PI) / 2;
      
      const term1 = Math.pow(bOmega, alpha);
      const term2 = Math.pow(bOmega, 2*alpha);
      
      // Shear modulus
      const numeratorG = G0 + (G0 + Ginf) * term1 * Math.cos(angle) + Ginf * term2;
      const denominatorG = 1 + 2 * term1 * Math.cos(angle) + term2;
      const G = numeratorG / denominatorG;
      
      // Loss factor
      const numeratorEta = (Ginf - G0) * term1 * Math.sin(angle);
      const denominatorEta = G0 + (G0 + Ginf) * term1 * Math.cos(angle) + Ginf * term2;
      const eta = numeratorEta / denominatorEta;
      
      data.omega.push(omega);
      data.G.push(G);
      data.eta.push(eta);
    });

    // Generate isothermal lines
    isothermalTemperatures.forEach(T => {
      const alphaT = calculateAlphaT(T, row);
      if (!alphaT) return;
      
      const isoData = data.omega.map(omega => ({
        x: omega,
        y: omega / alphaT // Original frequency
      }));
      
      data.isotherms.push({
        temperature: T,
        data: isoData
      });
    });

    return data;
  };

  const chartData = {
    datasets: plottedRows.flatMap((rowId, index) => {
      // const row = rows.find(r => r.id === rowId);
      const row = fields.find(r => r.id === rowId);
      if (!row) return [];
      const materialData = generateNomogramData(row);
      if (!materialData) return [];
      
      const color = colors[index % colors.length];
      const datasets = [];

      // Main curves
      datasets.push(
        {
          label: `Shear Modulus (${row.name || `Material ${index + 1}`})`,  // Show material name if available
          data: materialData.G.map((g, i) => ({ 
            x: materialData.omega[i], 
            y: g 
          })),
          borderColor: color,
          borderWidth: 2,
          yAxisID: 'yLeft',
          pointRadius: 0,
        },
        {
          label: `Loss Factor (${row.name || `Material ${index + 1}`})`,
          data: materialData.eta.map((eta, i) => ({ 
            x: materialData.omega[i], 
            y: eta 
          })),
          borderColor: color,
          borderDash: [5, 5],
          borderWidth: 1,
          yAxisID: 'yLeft',
          pointRadius: 0,
        }
      );

      // Isothermal lines
      materialData.isotherms.forEach((iso, isoIndex) => {
        datasets.push({
          label: `${iso.temperature}K Ref (${row.name || `M${index + 1}`})`,
          data: iso.data,
          borderColor: color,
          borderWidth: 0.5,
          pointRadius: 0,
          yAxisID: 'yRight',
          showLine: true,
          datalabels: { display: false }
        });
      });

      return datasets;
    }).filter(Boolean)
  };

  return (
    <div>
      <h5>Viscoelastic Material</h5>

      <div className="d-flex justify-content-between mb-3"> 
        <Button variant="primary" onClick={() => append(createEmptyViscoelasticMaterial())}>
          Add Viscoelastic Material
        </Button>
        <Button
          variant="danger"
          disabled={!viscoelasticMaterialRows?.some((row) => row.checked)}
          onClick={removeSelectedViscoelasticMaterials}
        >
          Remove Selected Rows
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Material Name</th> 
            <th>Working Temperature</th>
            <th>Reference Temperature</th>
            <th>Lower Shear Modulus</th>
            <th>Upper Shear Modulus</th>
            <th>Fractional Derivative Parameter</th>
            <th>Temperature Shifting Factor</th>
            <th>Teta 1</th>
            <th>Teta 2</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((row, index) => {
            const isPlotted = plottedRows.includes(row.id);
            return (
              <tr key={row.id}>
                <td>
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.checked`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => <Form.Check {...field} checked={field.value} />}
                  />
                </td>

                {/* Material Name input */}
                <td>
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.name`}
                    control={control}
                    rules={{ required: 'Material name is required' }}
                    defaultValue={row.name || ''}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="text"
                          placeholder="Enter material name"
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
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.workingTemperature`}
                    control={control}
                    rules={rules}
                    defaultValue={row.workingTemperature}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Enter working temperature"
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
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.referenceTemperature`}
                    control={control}
                    rules={rules}
                    defaultValue={row.referenceTemperature}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Enter reference temperature"
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
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.lowerShearModulus`}
                    control={control}
                    rules={getRulesLowerShearModulus(index)}
                    defaultValue={row.lowerShearModulus}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Enter lower shear modulus"
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
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.upperShearModulus`}
                    control={control}
                    rules={getRulesUpperShearModulus(index)}
                    defaultValue={row.upperShearModulus}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Enter upper shear modulus"
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
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.fractionalDerivativeParameter`}
                    control={control}
                    rules={rules}
                    defaultValue={row.fractionalDerivativeParameter}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Enter fractional derivative parameter"
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
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.temperatureShiftingFactor`}
                    control={control}
                    rules={rules}
                    defaultValue={row.temperatureShiftingFactor}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Enter temperature shifting factor"
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
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.teta1`}
                    control={control}
                    rules={rules}
                    defaultValue={row.teta1}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Enter Teta 1"
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
                  <Controller
                    name={`additionalParameters.viscoelasticMaterials.${index}.teta2`}
                    control={control}
                    rules={rules}
                    defaultValue={row.teta2}
                    render={({ field, fieldState }) => (
                      <>
                        <Form.Control
                          {...field}
                          type="number"
                          placeholder="Enter Teta 2"
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
                    variant={isPlotted ? 'danger' : 'primary'}
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
        <div className="mt-4">
          <h5>Viscoelastic Nomogram</h5>
          <Line data={chartData} options={{
            scales: {
              x: {
                type: 'logarithmic',
                title: { display: true, text: 'Reduced Frequency' },
                min: 1e-10,
                max: 1e10,
                ticks: {
                  callback: formatPowerOf10,
                  autoSkip: false,
                },
                afterBuildTicks: (axis) => {
                  axis.ticks = generatePowerOf10Ticks(-10, 10).map(value => ({ value }));
                }
              },
              yLeft: {
                type: 'logarithmic',
                position: 'left',
                title: { display: true, text: 'Shear Modulus [MPa] / Loss Factor' },
                min: 0.01,  // 10^-2
                max: 1e12,  // 10^12
                ticks: {
                  callback: formatPowerOf10,
                  autoSkip: false,
                },
                afterBuildTicks: (axis) => {
                  axis.ticks = generatePowerOf10Ticks(-2, 12).map(value => ({ value }));
                },
                grid: { drawOnChartArea: true },
              },
              yRight: {
                type: 'logarithmic',
                position: 'right',
                title: { display: true, text: 'Frequency [Hz]' },
                min: 0.01,  // 10^-2
                max: 1e12,  // 10^12
                ticks: {
                  callback: formatPowerOf10,
                  autoSkip: false,
                },
                afterBuildTicks: (axis) => {
                  axis.ticks = generatePowerOf10Ticks(-2, 12).map(value => ({ value }));
                },
                grid: { drawOnChartArea: false },
              }
            },
            plugins: {
              legend: {
                labels: {
                  filter: (item) => !item.text.includes('Ref')
                }
              },
              tooltip: {
                callbacks: {
                  title: (context) => `Ω: ${context[0].raw.x.toExponential(2)}`,
                  label: (ctx) => {
                    const label = ctx.dataset.label || '';
                    if (label.includes('Shear')) 
                      return `${label}: ${ctx.raw.y.toExponential(2)} Pa`;
                    if (label.includes('Loss')) 
                      return `${label}: ${ctx.raw.y.toFixed(3)}`;
                    return `${label}: ${ctx.raw.y.toExponential(2)} Hz`;
                  }
                }
              }
            }
          }} />
          <div className="text-muted small mt-2">
            Isothermal reference lines shown for temperatures: 253K, 273K, 293K, 313K, 333K
          </div>
        </div>
      )}
    </div>
  );
};

export default ViscoelasticMaterial;
