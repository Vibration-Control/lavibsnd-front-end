import React, { useState } from "react";
import { Modal, Button, Table, Form, Spinner, ProgressBar } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const FitFromDataModal = ({ show, onClose, appendViscoelasticMaterial }) => {
  const [dataRows, setDataRows] = useState([
    {
      temperature: "",
      frequency: "",
      shear: "",
      lossFactor: ""
    }
  ]);

  const [fitResult, setFitResult] = useState(null);
  const [isFitting, setIsFitting] = useState(false);
  const [progress, setProgress] = useState(0);


  const createFittedMaterial = () => {
    if (!fitResult) return;

    return {
      checked: false,
      name: "fitted viscoelastic material",
      workingTemperature: fitResult.T0,
      referenceTemperature: fitResult.T0,
      lowerShearModulus: fitResult.G0,
      upperShearModulus: fitResult.Ginf,
      fractionalDerivativeParameter: fitResult.alpha,
      temperatureShiftingFactor: fitResult.b,
      teta1: fitResult.theta1,
      teta2: fitResult.theta2,
    };
  };

  // -----------------------------
  // SHIFT FUNCTION
  // -----------------------------
  const calculateAlphaT = (T, p) => {
    const { T0, theta1, theta2 } = p;
    if ([T, T0, theta1, theta2].some(isNaN)) return NaN;

    const exponent = -theta1 * (T - T0) / (theta2 + (T - T0));
    return Math.pow(10, exponent);
  };

  // -----------------------------
  // MODEL
  // -----------------------------
  const computeShearModulus = (omega, p) => {
    const { G0, Ginf, b, alpha } = p;

    if (omega <= 0) return null;

    const bOmega = b * omega;
    const angle = (alpha * Math.PI) / 2;

    const t1 = Math.pow(bOmega, alpha);
    const t2 = Math.pow(bOmega, 2 * alpha);

    return (
      (G0 + (G0 + Ginf) * t1 * Math.cos(angle) + Ginf * t2) /
      (1 + 2 * t1 * Math.cos(angle) + t2)
    );
  };

  const computeLossModulus = (omega, p) => {
    const { G0, Ginf, b, alpha } = p;

    if (omega <= 0) return null;

    const bOmega = b * omega;
    const angle = (alpha * Math.PI) / 2;

    const t1 = Math.pow(bOmega, alpha);
    const t2 = Math.pow(bOmega, 2 * alpha);

    return (
      ((Ginf - G0) * t1 * Math.sin(angle)) /
      (1 + 2 * t1 * Math.cos(angle) + t2)
    );
  };

  const computeLossFactor = (omega, p) => {
    const Gp = computeShearModulus(omega, p);
    const Gpp = computeLossModulus(omega, p);

    if (!Gp || Gp <= 0) return null;

    return Gpp / Gp;
  };

  // -----------------------------
  // FIT (ASYNC + PROGRESS)
  // -----------------------------
  const fitModel = async (rows) => {
    const data = rows
      .map((r) => ({
        T: parseFloat(r.temperature),
        omega: parseFloat(r.frequency),
        G: parseFloat(r.shear),
        eta: parseFloat(r.lossFactor)
      }))
      .filter(
        (r) =>
          r.T &&
          r.omega > 0 &&
          (
            (Number.isFinite(r.G) && r.G > 0) ||
            (Number.isFinite(r.eta) && r.eta > 0)
          )
      );
    const T0 = data[0].T;

    const chi2 = (p) => {
      let err = 0;

      for (const { T, omega, G, eta } of data) {
        const aT = calculateAlphaT(T, { ...p, T0 });

        if (!aT || aT <= 0) return 1e12;

        const reducedOmega = omega * aT;

        if (Number.isFinite(G) && G > 0) {
          const Gm = computeShearModulus(reducedOmega, p);

          if (!Gm || Gm <= 0) return 1e12;

          const dG = Math.log(Gm) - Math.log(G);

          err += dG * dG;
        }

        if (Number.isFinite(eta) && eta > 0) {
          const etaM = computeLossFactor(reducedOmega, p);

          if (!etaM || etaM <= 0) return 1e12;

          const dEta = Math.log(etaM) - Math.log(eta);

          err += dEta * dEta;
        }
      }

      return err;
    };

    const validG = data
      .filter((d) => Number.isFinite(d.G) && d.G > 0)
      .map((d) => d.G);

    let best = {
      G0: validG.length ? Math.min(...validG) : 1e5,
      Ginf: validG.length ? Math.max(...validG) : 1e9,
      b: 1,
      alpha: 0.5,
      theta1: 10,
      theta2: 100
    };
    let bestErr = chi2(best);

    const iterations = 50000;
    const batchSize = 50;

    for (let i = 0; i < iterations; i++) {
      const candidate = {
        G0: best.G0 * (0.5 + Math.random()),
        Ginf: best.Ginf * (0.5 + Math.random()),
        b: best.b * (0.2 + Math.random() * 3),
        alpha: Math.min(0.99, Math.max(0.01, best.alpha + (Math.random() - 0.5) * 0.3)),
        theta1: best.theta1 * (0.5 + Math.random()),
        theta2: best.theta2 * (0.5 + Math.random())
      };
      const err = chi2(candidate);

      if (err < bestErr) {
        best = candidate;
        bestErr = err;

        // live update
        setFitResult({ ...best, T0, chi2: bestErr });
      }

      // allow UI refresh
      if (i % batchSize === 0) {
        setProgress((i / iterations) * 100);
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    return { ...best, T0, chi2: bestErr };
  };

  // -----------------------------
  // ACTIONS
  // -----------------------------
  const handleFit = async () => {
    setIsFitting(true);
    setProgress(0);
    setFitResult(null);

    const res = await fitModel(dataRows);

    setFitResult(res);
    setProgress(100);
    setIsFitting(false);
  };

  const addRow = () =>
    setDataRows([
      ...dataRows,
      {
        temperature: "",
        frequency: "",
        shear: "",
        lossFactor: ""
      }
    ]);

  const removeRow = (i) =>
    setDataRows(dataRows.filter((_, idx) => idx !== i));

  const updateRow = (i, field, value) => {
    const updated = [...dataRows];
    updated[i][field] = value;
    setDataRows(updated);
  };

  // -----------------------------
  // CHART
  // -----------------------------
  const getChartData = () => {
    const modulusExp = dataRows
      .map((r) => {
        const T = parseFloat(r.temperature);
        const w = parseFloat(r.frequency);
        const G = parseFloat(r.shear);

        if (!T || !w || !G) return null;

        const x = fitResult
          ? w * calculateAlphaT(T, fitResult)
          : w;

        return {
          x,
          y: G
        };
      })
      .filter(Boolean);

    const lossExp = dataRows
      .map((r) => {
        const T = parseFloat(r.temperature);
        const w = parseFloat(r.frequency);
        const eta = parseFloat(r.lossFactor);

        if (!T || !w || !eta) return null;

        const x = fitResult
          ? w * calculateAlphaT(T, fitResult)
          : w;

        return {
          x,
          y: eta
        };
      })
      .filter(Boolean);

    const datasets = [
      {
        label: "Experimental Shear Modulus",
        data: modulusExp,
        showLine: false,
        yAxisID: "yModulus"
      },
      {
        label: "Experimental Loss Factor",
        data: lossExp,
        showLine: false,
        yAxisID: "yLoss"
      }
    ];

    if (fitResult) {
      const freq = Array.from(
        { length: 200 },
        (_, i) => Math.pow(10, -10 + (i / 199) * 20)
      );

      datasets.push({
        label: "Fitted Shear Modulus",
        data: freq.map((f) => ({
          x: f,
          y: computeShearModulus(f, fitResult)
        })),
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: "yModulus"
      });

      datasets.push({
        label: "Fitted Loss Factor",
        data: freq.map((f) => ({
          x: f,
          y: computeLossFactor(f, fitResult)
        })),
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: "yLoss"
      });
    }

    return { datasets };
  };

  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Fit Viscoelastic Model from Data</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex gap-4">

          {/* LEFT */}
          <div style={{ flex: 2 }}>
            <Table bordered size="sm">
              <thead>
                <tr>
                  <th>Temperature [K]</th>
                  <th>Frequency [Hz]</th>
                  <th>Shear Modulus [Pa]</th>
                  <th>Loss Factor [-]</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <Form.Control
                        value={row.temperature}
                        onChange={(e) => updateRow(i, "temperature", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        value={row.frequency}
                        onChange={(e) => updateRow(i, "frequency", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        value={row.shear}
                        onChange={(e) => updateRow(i, "shear", e.target.value)}
                      />
                    </td>
                    <td>
                      <Form.Control
                        value={row.lossFactor}
                        onChange={(e) =>
                          updateRow(i, "lossFactor", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => removeRow(i)}>
                        ✕
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button size="sm" onClick={addRow}>
              Add Row
            </Button>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1 }}>
            <h5>Fit Results</h5>

            {isFitting && (
              <>
                <Spinner animation="border" size="sm" />
                <ProgressBar now={progress} className="mt-2" />
              </>
            )}

            {fitResult && (
              <Table size="sm" className="mt-2">
                <tbody>
                  <tr><td>Lower Shear Modulus (G0)</td><td>{fitResult.G0.toExponential(3)}</td></tr>
                  <tr><td>Upper Shear Modulus (G∞)</td><td>{fitResult.Ginf.toExponential(3)}</td></tr>
                  <tr><td>Fractional Parameter (α)</td><td>{fitResult.alpha.toFixed(3)}</td></tr>
                  <tr><td>Shift Factor (b)</td><td>{fitResult.b.toExponential(3)}</td></tr>
                  <tr><td>Theta 1</td><td>{fitResult.theta1.toExponential(3)}</td></tr>
                  <tr><td>Theta 2</td><td>{fitResult.theta2.toExponential(3)}</td></tr>
                  <tr><td>Chi-Squared</td><td>{fitResult.chi2.toExponential(3)}</td></tr>
                </tbody>
              </Table>
            )}
          </div>
        </div>

        <div className="mt-4">
          <Line
            key={JSON.stringify(fitResult)}
            data={getChartData()}
            options={{
              animation: false,
              scales: {
                x: {
                  type: "logarithmic",
                  title: {
                    display: true,
                    text: "Reduced Frequency"
                  }
                },

                yModulus: {
                  type: "logarithmic",
                  position: "left",
                  title: {
                    display: true,
                    text: "Shear Modulus [Pa]"
                  }
                },

                yLoss: {
                  type: "linear",
                  position: "right",
                  title: {
                    display: true,
                    text: "Loss Factor [-]"
                  },
                  grid: {
                    drawOnChartArea: false
                  }
                }
              }
            }}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Cancel
        </Button>

        {fitResult && !isFitting && (
          <Button
            variant="success"
            onClick={() => appendViscoelasticMaterial(createFittedMaterial())}
          >
            Use Fitted Material
          </Button>
        )}

        <Button onClick={handleFit} disabled={isFitting}>
          {isFitting ? "Fitting..." : "Run Fit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FitFromDataModal;