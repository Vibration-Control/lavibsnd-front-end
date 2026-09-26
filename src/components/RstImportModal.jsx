import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const MODE_DIRECTIONS = {
  UX: [1, 0, 0, 0, 0, 0],
  UY: [0, 1, 0, 0, 0, 0],
  UZ: [0, 0, 1, 0, 0, 0],
  ROTX: [0, 0, 0, 1, 0, 0],
  ROTY: [0, 0, 0, 0, 1, 0],
  ROTZ: [0, 0, 0, 0, 0, 1],
};

const DIRECTION_LABELS = {
  UX: "Translation X",
  UY: "Translation Y",
  UZ: "Translation Z",
  ROTX: "Rotation X",
  ROTY: "Rotation Y",
  ROTZ: "Rotation Z",
};

const RstImportModal = ({ show, onHide, onImport }) => {
  const [selectedDirection, setSelectedDirection] = useState("UX");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith(".rst")) {
      alert("Please select an ANSYS .rst file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInput = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      return;
    }

    onImport({
      file: selectedFile,
      modeProjection: {
        components: MODE_DIRECTIONS[selectedDirection],
      },
    });

    // Reset modal state
    setSelectedFile(null);
    setSelectedDirection("UX");
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedDirection("UX");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Import ANSYS RST File</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* File drop area */}
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("rst-file-input").click()}
          style={{
            border: "2px dashed #aaa",
            borderRadius: "8px",
            padding: "30px 20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragging ? "#f0f0f0" : "transparent",
          }}
        >
          {selectedFile ? (
            <>
              <strong>{selectedFile.name}</strong>
              <div className="text-muted mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </>
          ) : (
            <>
              <div>
                <strong>Drop your .rst file here</strong>
              </div>

              <div className="text-muted mt-2">
                or click to browse
              </div>
            </>
          )}

          <input
            id="rst-file-input"
            type="file"
            accept=".rst,application/octet-stream"
            style={{ display: "none" }}
            onChange={handleFileInput}
          />
        </div>

        {/* Direction selection */}
        <div className="mt-4">
          <Form.Label>
            <strong>Mode direction</strong>
          </Form.Label>

          <div className="mt-2">
            {Object.keys(MODE_DIRECTIONS).map((direction) => (
              <Form.Check
                key={direction}
                type="radio"
                name="rst-mode-direction"
                id={`rst-direction-${direction}`}
                label={DIRECTION_LABELS[direction]}
                value={direction}
                checked={selectedDirection === direction}
                onChange={() => setSelectedDirection(direction)}
                className="mb-2"
              />
            ))}
          </div>
        </div>

        {/* Selected projection preview */}
        <div className="mt-3 p-2 bg-light rounded">
          <small className="text-muted">
            Projection:{" "}
            <code>
              [{MODE_DIRECTIONS[selectedDirection].join(", ")}]
            </code>
          </small>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleImport}
          disabled={!selectedFile}
        >
          Import RST
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RstImportModal;