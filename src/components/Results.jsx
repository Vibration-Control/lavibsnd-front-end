import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useWatch } from 'react-hook-form'
import DimensionNeutralizers from './DimensionNeutralizers'; // ajuste o caminho se necessário
import './Results.css'; // Import cust
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
  annotationPlugin
);

const Results = ({ optimizationResult, control }) => {
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [showNeutralizers, setShowNeutralizers] = useState(false);
  const [frfType, setFrfType] = useState('receptance'); // 'receptance' | 'mobility' | 'inertance'
  const [showDimensionNeutralizers, setShowDimensionNeutralizers] = useState(false);
  const [showControlBounds, setShowControlBounds] = useState(true);

  const objectiveFunctionSearchLowerBound =
    useWatch({
      control,
      name:
        'objectiveFunctionSearchLowerBound'
    }) ?? 10

  const objectiveFunctionSearchUpperBound =
    useWatch({
      control,
      name:
        'objectiveFunctionSearchUpperBound'
    }) ?? 30

  const chartData = useMemo(() => {
    if (!optimizationResult) return null;

    const frequencies = optimizationResult.frequency;
    let primaryFRF = optimizationResult.primary_system_frf;
    let composedFRF = optimizationResult.composed_system_frf;

    if (frfType === 'mobility') {
      primaryFRF = primaryFRF.map((val, i) =>
        val !== 0 ? val + 20 * Math.log10(2 * Math.PI * frequencies[i]) : 0
      );
      composedFRF = composedFRF.map((val, i) =>
        val !== 0 ? val + 20 * Math.log10(2 * Math.PI * frequencies[i]) : 0
      );
    } else if (frfType === 'inertance') {
      primaryFRF = primaryFRF.map((val, i) =>
        val !== 0 ? val + 40 * Math.log10(2 * Math.PI * frequencies[i]) : 0
      );
      composedFRF = composedFRF.map((val, i) =>
        val !== 0 ? val + 40 * Math.log10(2 * Math.PI * frequencies[i]) : 0
      );
    }

    // Main datasets
    const datasets = [
      {
        label: 'Primary System',
        data: primaryFRF,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2,
        fill: false,
        tension: 0.2,
        pointRadius: 0,
      },
      {
        label: 'Composed System',
        data: composedFRF,
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 2,
        fill: false,
        tension: 0.2,
        pointRadius: 0,
      },
    ];

    // Add detuned receptances with visually distinct colors
    if (optimizationResult.receptances_with_detuning) {
      const n = optimizationResult.receptances_with_detuning.length;
      optimizationResult.receptances_with_detuning.forEach((item, idx) => {
        let detunedFRF = item.receptance;

        // Apply mobility/inertance conversion if needed
        if (frfType === 'mobility') {
          detunedFRF = detunedFRF.map((val, i) =>
            val !== 0 ? val + 20 * Math.log10(2 * Math.PI * frequencies[i]) : 0
          );
        } else if (frfType === 'inertance') {
          detunedFRF = detunedFRF.map((val, i) =>
            val !== 0 ? val + 40 * Math.log10(2 * Math.PI * frequencies[i]) : 0
          );
        }

        // Generate a distinct HSL color
        const hue = Math.round((idx / n) * 360); // evenly spaced hue
        const color = `hsl(${hue}, 80%, 50%)`;

        datasets.push({
          label: `Composed System detuned at ${item.temperature} K`,
          data: detunedFRF,
          borderColor: color,
          borderWidth: 2,
          fill: false,
          tension: 0.2,
          pointRadius: 0,
          borderDash: [5, 5],
        });
      });
    }

    return {
      datasets: datasets.map((dataset) => ({
        ...dataset,
        parsing: false,
        data: frequencies.map((frequency, index) => ({
          x: Number(frequency),
          y: Number(dataset.data[index]),
        })),
      })),
    };
  }, [optimizationResult, frfType]);

  const handleDownloadResults = () => {
    if (!optimizationResult) return;

    const jsonString = JSON.stringify(optimizationResult, null, 2);

    const blob = new Blob([jsonString], {
      type: 'application/json',
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'optimization_results.json';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  const chartOptions = useMemo(() => {
    if (!optimizationResult) return {};

    const frequencies = optimizationResult.frequency || [];

    const minFrequency = Math.min(...frequencies);
    const maxFrequency = Math.max(...frequencies);

    return {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: 'top',
        },

        tooltip: {
          mode: 'index',
          intersect: false,
        },

        annotation: {
          annotations: showControlBounds
            ? {
              controlLowerBound: {
                type: 'line',

                xMin:
                  objectiveFunctionSearchLowerBound,

                xMax:
                  objectiveFunctionSearchLowerBound,

                borderColor: 'red',

                borderWidth: 2,

                label: {
                  display: true,

                  content: 'Control Lower',
                },
              },

              controlUpperBound: {
                type: 'line',

                xMin:
                  objectiveFunctionSearchUpperBound,

                xMax:
                  objectiveFunctionSearchUpperBound,

                borderColor: 'red',

                borderWidth: 2,

                label: {
                  display: true,

                  content: 'Control Upper',
                },
              },
            }
            : {},
        },
      },

      scales: {
        x: {
          type: 'linear',

          offset: false,

          min: Number(minFrequency),

          max: Number(maxFrequency),

          title: {
            display: true,
            text: 'Frequency (Hz)',
          },

          ticks: {
            precision: 2,
          },
        },

        y: {
          title: {
            display: true,

            text:
              frfType === 'receptance'
                ? 'Receptance (dB) ref. 1[m/N]'
                : frfType === 'mobility'
                  ? 'Mobility (dB) ref. 1[m/s/N]'
                  : 'Inertance (dB) ref. 1[m/s²/N]',
          },
        },
      },
    };
  }, [optimizationResult, frfType, showControlBounds]);

  const renderTable = (type, label, fields) => {
    const filtered = (optimizationResult.solution || []).filter(n => n.type === type);
    if (filtered.length === 0) return null;

    return (
      <div className="mb-4">
        <h5>{label}</h5>
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              {fields.map(f => (
                <th key={f}>{f === 'viscoelastic_material' ? 'Material Name' : f}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((n, idx) => (
              <tr key={idx}>
                {fields.map(f => (
                  <td key={f}>
                    {f === 'viscoelastic_material' && n[f] ? (
                      <div className="tooltip-wrapper">
                        <span className="tooltip-target">{n[f].name}</span>
                        <div className="tooltip-content">
                          {Object.entries(n[f])
                            .filter(([k]) => k !== 'name')
                            .map(([k, v]) => (
                              <div key={k}>{k}: {v}</div>
                            ))}
                        </div>
                      </div>
                    ) : n[f] !== undefined ? (
                      n[f]
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  if (!optimizationResult) {
    return <p>No optimization result yet.</p>;
  }

  return (
    <div className="mt-4">
      <div className="mb-3">
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="frfType"
            id="receptance"
            value="receptance"
            checked={frfType === 'receptance'}
            onChange={(e) => setFrfType(e.target.value)}
          />
          <label className="form-check-label" htmlFor="receptance">
            Receptance
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="frfType"
            id="mobility"
            value="mobility"
            checked={frfType === 'mobility'}
            onChange={(e) => setFrfType(e.target.value)}
          />
          <label className="form-check-label" htmlFor="mobility">
            Mobility
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="frfType"
            id="inertance"
            value="inertance"
            checked={frfType === 'inertance'}
            onChange={(e) => setFrfType(e.target.value)}
          />
          <label className="form-check-label" htmlFor="inertance">
            Inertance
          </label>
        </div>
      </div>

      <div className="card mb-4">
        <div
          className="card-body"
          style={{ height: '500px' }}
        >
          {chartData && <Line data={chartData} options={chartOptions} />}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">

          <button
            className="btn btn-outline-primary"
            onClick={() => setShowFullResponse(!showFullResponse)}
          >
            {showFullResponse ? 'Hide Full Response' : 'Show Full Response'}
          </button>

          <button
            className="btn btn-outline-success"
            onClick={() => setShowNeutralizers(!showNeutralizers)}
          >
            {showNeutralizers ? 'Hide Optimal Neutralizers' : 'Show Optimal Neutralizers'}
          </button>

          <button
            className="btn btn-outline-warning"
            onClick={() => setShowDimensionNeutralizers(!showDimensionNeutralizers)}
          >
            {showDimensionNeutralizers
              ? 'Hide Dimension Neutralizers'
              : 'Show Dimension Neutralizers'}
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() =>
              setShowControlBounds(!showControlBounds)
            }
          >
            {showControlBounds
              ? 'Hide Control Bounds'
              : 'Show Control Bounds'}
          </button>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleDownloadResults}
        >
          Download Results
        </button>
      </div>



      {showFullResponse && (
        <div className="card mt-3">
          <div className="card-body" style={{ maxHeight: '500px', overflow: 'auto' }}>
            <pre>{JSON.stringify(optimizationResult, null, 2)}</pre>
          </div>
        </div>
      )}

      {showNeutralizers && (
        <div className="card mt-3">
          <div className="card-body">
            {renderTable(2, 'Viscous Neutralizers', [
              'mass', 'modal_position', 'frequency', 'damp',
            ])}
            {renderTable(1, 'Viscoelastic Neutralizers', [
              'mass',
              'modal_position',
              'frequency',
              'viscoelastic_material',
            ])}
            {renderTable(0, 'User-defined Stiffness Neutralizers', [
              'mass', 'modal_position', 'frequency', 'dynamic_stiffness',
            ])}
          </div>
        </div>
      )}

      {showDimensionNeutralizers && (
        <div className="card mt-3">
          <div className="card-body">
            <DimensionNeutralizers optimizationResult={optimizationResult} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Results;
