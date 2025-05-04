import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

const Results = ({ optimizationResult }) => {
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [frfType, setFrfType] = useState('receptance'); // 'receptance' | 'mobility' | 'inertance'

  const chartData = useMemo(() => {
    if (!optimizationResult) return null;

    const frequencies = optimizationResult.frequency;
    let primaryFRF = optimizationResult.primary_system_frf;
    let composedFRF = optimizationResult.composed_system_frf;

    // Calculate mobility and inertance if needed
    // Update FRFs based on selected type (all in dB)
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


    return {
      labels: frequencies,
      datasets: [
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
      ],
    };
  }, [optimizationResult, frfType]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: '',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Frequency (Hz)',
        },
        ticks: {
          callback: function (value, index, ticks) {
            const totalTicks = 20;
            const step = Math.floor(ticks.length / totalTicks);
            return index % step === 0 ? this.getLabelForValue(value) : '';
          },
          autoSkip: false,
        },
      },
      y: {
        title: {
          display: true,
          text:
            frfType === 'receptance'
              ? 'Receptance (dB)'
              : frfType === 'mobility'
                ? 'Mobility (dB)'
                : 'Inertance (dB)',
        },
      },
    },
  }), [frfType]);

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
        <div className="card-body">
          {chartData && <Line data={chartData} options={chartOptions} />}
        </div>
      </div>

      <button
        className="btn btn-outline-primary mb-3"
        onClick={() => setShowFullResponse(!showFullResponse)}
      >
        {showFullResponse ? 'Hide Full Response' : 'Show Full Response'}
      </button>

      {showFullResponse && (
        <div className="card mt-3">
          <div className="card-body" style={{ maxHeight: '500px', overflow: 'auto' }}>
            <pre>{JSON.stringify(optimizationResult, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
