import React, { useState, useEffect } from 'react';
import { create, all } from 'mathjs';
const math = create(all);

const DimensionNeutralizers = ({ optimizationResult }) => {
  const viscoelasticNeutralizers = (optimizationResult.solution || []).filter(n => n.type === 1);

  const calculateAlfa = (TT0, TT1, teta1, teta2) => {
    const deltaT = TT1 - TT0;
    return 10 ** (-teta1 * deltaT / (teta2 + deltaT));
  };

  const calculateGwa = (neutralizer) => {
    try {
      const { viscoelastic_material, frequency } = neutralizer;
      const { GL, GH, FI, TT0, TT1, teta1, teta2, beta } = viscoelastic_material;

      console.log(viscoelastic_material)

      const alfa = calculateAlfa(TT0, TT1, teta1, teta2);
      const w = 2 * Math.PI * frequency;

      console.log(frequency)
      console.log(alfa)
      console.log(w)

      const jw = math.multiply(math.complex(0, 1), alfa * w);
      const jw_beta = math.pow(jw, beta);

      const numerator = math.add(GL, math.multiply(GH * FI, jw_beta));
      const denominator = math.add(1, math.multiply(FI, jw_beta));

      console.log(numerator)
      console.log(denominator)
      const G = math.divide(numerator, denominator);

      return G; // full complex value
    } catch (e) {
      console.error('Error calculating G*:', e);
      return math.complex(NaN, NaN);
    }
  };

  const computeRowData = (neutralizer) => {
    const Gwa = calculateGwa(neutralizer);
    const Gabs = math.abs(Gwa);

    const { frequency, mass } = neutralizer;
    const Fgeo = (frequency ** 2) * mass / Gabs;

    const e = 1; // default
    const A = Fgeo * e;

    return {
      name: neutralizer.viscoelastic_material.name,
      Gwa: Gwa,
      Gabs,
      Fgeo,
      A,
      e,
    };
  };

  const [rows, setRows] = useState(
    viscoelasticNeutralizers.map(computeRowData)
  );

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    const row = { ...updated[index], [field]: parseFloat(value) };

    const { Fgeo } = row;
    if (field === 'A') {
      row.e = row.A / Fgeo;
    } else if (field === 'e') {
      row.A = Fgeo * row.e;
    }

    updated[index] = row;
    setRows(updated);
  };

  return (
    <div className="mb-4">
      <h5>Dimension Viscoelastic Neutralizers</h5>
      <table className="table table-bordered table-sm mt-3">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>G* (Pa)</th>
            <th>|G*| (Pa)</th>
            <th>Fgeo</th>
            <th>Area A (mm²)</th>
            <th>Thickness e (mm)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>{row.Gwa.toString()}</td>
              <td>{row.Gabs.toExponential(3)}</td>
              <td>{row.Fgeo.toExponential(3)}</td>
              <td>
                <input
                  type="number"
                  value={row.A}
                  step="0.0001"
                  onChange={(e) => handleChange(i, 'A', e.target.value)}
                  style={{ width: '100px' }}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.e}
                  step="0.0001"
                  onChange={(e) => handleChange(i, 'e', e.target.value)}
                  style={{ width: '100px' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DimensionNeutralizers;
