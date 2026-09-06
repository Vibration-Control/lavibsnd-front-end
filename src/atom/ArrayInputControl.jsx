import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Form, Modal, Button } from 'react-bootstrap';

const ROW_HEIGHT = 42;
const OVERSCAN = 10;

const ArrayInputControl = React.forwardRef(
    (
        {
            value = '',
            onChange,
            onBlur,
            name,
            placeholder,
            disabled = false,
            className = '',
            enableIntegerRange = false,
            ...props
        },
        ref
    ) => {
        const [showModal, setShowModal] = useState(false);

        /*
         * Temporary row being created.
         */
        const [newRow, setNewRow] = useState(null);

        /*
         * Integer range fields.
         */
        const [lowerBound, setLowerBound] = useState('');
        const [upperBound, setUpperBound] = useState('');

        /*
         * Scroll position used for virtualization.
         */
        const [scrollTop, setScrollTop] = useState(0);

        const scrollContainerRef = useRef(null);
        const newRowInputRef = useRef(null);

        /*
         * Convert the string representation used by the form
         * into an actual array.
         */
        const arrayValue = useMemo(() => {
            if (Array.isArray(value)) {
                return value;
            }

            if (
                typeof value !== 'string' ||
                value.trim() === ''
            ) {
                return [];
            }

            try {
                const parsed = JSON.parse(value);

                return Array.isArray(parsed)
                    ? parsed
                    : [];
            } catch {
                return [];
            }
        }, [value]);

        /*
         * Keep your original string representation.
         */
        const displayValue = useMemo(() => {
            if (!value) {
                return '';
            }

            return value;
        }, [value]);

        /*
         * Update the form immediately.
         */
        const updateArray = useCallback(
            (newArray) => {
                if (typeof onChange === 'function') {
                    onChange(JSON.stringify(newArray));
                }
            },
            [onChange]
        );

        /*
         * Edit an existing element.
         */
        const updateCell = useCallback(
            (index, newValue) => {
                const parsedValue =
                    parseNumber(newValue);

                /*
                 * Allow empty string temporarily while editing.
                 */
                if (parsedValue === '') {
                    const newArray = [...arrayValue];
                    newArray[index] = '';

                    updateArray(newArray);
                    return;
                }

                /*
                 * Ignore invalid input.
                 */
                if (parsedValue === null) {
                    return;
                }

                const newArray = [...arrayValue];

                newArray[index] = parsedValue;

                updateArray(newArray);
            },
            [arrayValue, updateArray]
        );

        /*
         * Delete an existing element.
         */
        const deleteCell = useCallback(
            (index) => {
                const newArray =
                    arrayValue.filter(
                        (_, i) => i !== index
                    );

                updateArray(newArray);
            },
            [arrayValue, updateArray]
        );

        /*
         * Start creating a new element.
         *
         * Does not modify the actual array yet.
         */
        const startInsert = useCallback(
            (index) => {
                setNewRow({
                    index,
                    value: '',
                });
            },
            []
        );

        /*
         * Handle creation of a new element.
         *
         * The element is only inserted once the user
         * enters a valid number.
         */
        const handleNewRowChange = useCallback(
            (rawValue) => {
                if (
                    rawValue === undefined ||
                    rawValue === null
                ) {
                    return;
                }

                /*
                 * Empty value remains an uncommitted row.
                 */
                if (rawValue.trim() === '') {
                    setNewRow((previous) =>
                        previous
                            ? {
                                  ...previous,
                                  value: '',
                              }
                            : previous
                    );

                    return;
                }

                const parsedValue =
                    parseNumber(rawValue);

                /*
                 * Ignore invalid values.
                 */
                if (parsedValue === null) {
                    return;
                }

                const insertIndex = newRow.index;

                const newArray = [...arrayValue];

                newArray.splice(
                    insertIndex,
                    0,
                    parsedValue
                );

                updateArray(newArray);

                setNewRow(null);

                /*
                 * Focus the newly-created actual row.
                 */
                requestAnimationFrame(() => {
                    const input =
                        document.getElementById(
                            `${name}-array-cell-${insertIndex}`
                        );

                    if (input) {
                        input.focus();

                        try {
                            input.selectionStart =
                                input.value.length;
                            input.selectionEnd =
                                input.value.length;
                        } catch {
                            // Ignore selection errors.
                        }
                    }
                });
            },
            [
                arrayValue,
                name,
                newRow,
                updateArray,
            ]
        );

        /*
         * Paste Excel / TXT data.
         */
        const handlePaste = useCallback(
            (event, startIndex = null) => {
                const text =
                    event.clipboardData?.getData(
                        'text/plain'
                    );

                if (!text) {
                    return;
                }

                if (
                    text.includes('\n') ||
                    text.includes('\t')
                ) {
                    event.preventDefault();

                    const rawValues = text
                        .trim()
                        .split(/[\t\r\n]+/)
                        .filter(
                            (item) =>
                                item.trim() !== ''
                        );

                    const values =
                        rawValues.map(parseNumber);

                    /*
                     * Reject the entire paste if even one
                     * value is not numeric.
                     */
                    if (
                        values.some(
                            (item) =>
                                item === null ||
                                item === ''
                        )
                    ) {
                        return;
                    }

                    /*
                     * Paste starting at selected index.
                     */
                    if (
                        startIndex !== null &&
                        startIndex !== undefined
                    ) {
                        const newArray = [
                            ...arrayValue,
                        ];

                        newArray.splice(
                            startIndex,
                            values.length,
                            ...values
                        );

                        updateArray(newArray);
                    } else {
                        updateArray(values);
                    }
                }
            },
            [arrayValue, updateArray]
        );

        /*
         * --------------------------------------------------
         * INTEGER RANGE FEATURE
         * --------------------------------------------------
         *
         * Creates:
         *
         * lower = 1
         * upper = 5
         *
         * =>
         *
         * [1, 2, 3, 4, 5]
         */
        const addIntegerRange = useCallback(() => {
            const lower = Number(lowerBound);
            const upper = Number(upperBound);

            /*
             * Validate bounds.
             */
            if (
                !Number.isFinite(lower) ||
                !Number.isFinite(upper)
            ) {
                return;
            }

            /*
             * Bounds must be integers.
             */
            if (
                !Number.isInteger(lower) ||
                !Number.isInteger(upper)
            ) {
                return;
            }

            /*
             * Lower must not be greater than upper.
             */
            if (lower > upper) {
                return;
            }

            /*
             * Protect against accidentally creating
             * an enormous array.
             *
             * Adjust/remove this limit if your application
             * legitimately needs more.
             */
            const count = upper - lower + 1;

            if (count > 100000) {
                window.alert(
                    'The selected range is too large.'
                );

                return;
            }

            const newValues = new Array(count);

            for (
                let i = 0;
                i < count;
                i++
            ) {
                newValues[i] = lower + i;
            }

            /*
             * Add the generated values to the END
             * of the existing array.
             */
            updateArray([
                ...arrayValue,
                ...newValues,
            ]);

            /*
             * Clear the range fields after action.
             */
            setLowerBound('');
            setUpperBound('');
        }, [
            arrayValue,
            lowerBound,
            upperBound,
            updateArray,
        ]);

        /*
         * Virtualization.
         */
        const visibleRange = useMemo(() => {
            const totalRows =
                arrayValue.length +
                (newRow ? 1 : 0);

            if (totalRows === 0) {
                return {
                    start: 0,
                    end: 0,
                };
            }

            const start = Math.max(
                0,
                Math.floor(
                    scrollTop / ROW_HEIGHT
                ) - OVERSCAN
            );

            const visibleRows =
                Math.ceil(
                    600 / ROW_HEIGHT
                );

            const end = Math.min(
                totalRows,
                start +
                    visibleRows +
                    OVERSCAN * 2
            );

            return {
                start,
                end,
            };
        }, [
            arrayValue.length,
            newRow,
            scrollTop,
        ]);

        /*
         * Build only visible rows.
         */
        const visibleRows = useMemo(() => {
            const rows = [];

            for (
                let virtualIndex =
                    visibleRange.start;
                virtualIndex < visibleRange.end;
                virtualIndex++
            ) {
                /*
                 * Temporary new row.
                 */
                if (
                    newRow &&
                    virtualIndex === newRow.index
                ) {
                    rows.push({
                        type: 'new',
                        virtualIndex,
                        arrayIndex:
                            newRow.index,
                    });

                    continue;
                }

                /*
                 * Map virtual index to actual array index.
                 */
                const arrayIndex =
                    newRow &&
                    virtualIndex > newRow.index
                        ? virtualIndex - 1
                        : virtualIndex;

                if (
                    arrayIndex >= 0 &&
                    arrayIndex < arrayValue.length
                ) {
                    rows.push({
                        type: 'existing',
                        virtualIndex,
                        arrayIndex,
                    });
                }
            }

            return rows;
        }, [
            arrayValue,
            newRow,
            visibleRange,
        ]);

        const handleScroll = useCallback(
            (event) => {
                setScrollTop(
                    event.currentTarget.scrollTop
                );
            },
            []
        );

        /*
         * Focus newly created row.
         */
        useEffect(() => {
            if (
                newRow &&
                newRowInputRef.current
            ) {
                newRowInputRef.current.focus();
            }
        }, [newRow]);

        /*
         * Reset scroll when modal opens.
         */
        useEffect(() => {
            if (
                showModal &&
                scrollContainerRef.current
            ) {
                scrollContainerRef.current.scrollTop = 0;
                setScrollTop(0);
            }
        }, [showModal]);

        /*
         * Close modal.
         */
        const handleClose = () => {
            setNewRow(null);
            setShowModal(false);
        };

        const totalRows =
            arrayValue.length +
            (newRow ? 1 : 0);

        const totalHeight =
            totalRows * ROW_HEIGHT;

        const topSpacerHeight =
            visibleRange.start * ROW_HEIGHT;

        const bottomSpacerHeight = Math.max(
            0,
            totalHeight -
                topSpacerHeight -
                visibleRows.length *
                    ROW_HEIGHT
        );

        return (
            <>
                {/* --------------------------------------------- */}
                {/* NORMAL FORM CONTROL */}
                {/* --------------------------------------------- */}

                <div
                    className="position-relative"
                    onClick={() => {
                        if (!disabled) {
                            setShowModal(true);
                        }
                    }}
                    style={{
                        cursor: disabled
                            ? 'not-allowed'
                            : 'pointer',
                    }}
                >
                    <Form.Control
                        {...props}
                        ref={ref}
                        name={name}
                        value={displayValue}
                        onBlur={onBlur}
                        disabled={disabled}
                        className={`pe-5 ${className}`}
                        placeholder={placeholder}
                        type="text"
                        readOnly
                        style={{
                            cursor: disabled
                                ? 'not-allowed'
                                : 'pointer',
                        }}
                    />

                    <span
                        className="position-absolute text-muted"
                        style={{
                            right: '12px',
                            top: '50%',
                            transform:
                                'translateY(-50%)',
                            pointerEvents: 'none',
                            fontSize: '16px',
                        }}
                    >
                        ☷
                    </span>
                </div>

                {/* --------------------------------------------- */}
                {/* MODAL */}
                {/* --------------------------------------------- */}

                <Modal
                    show={showModal}
                    onHide={handleClose}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Array Editor
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {/* ------------------------------------- */}
                        {/* INTEGER RANGE */}
                        {/* ------------------------------------- */}

                        {enableIntegerRange && (
                            <div className="border rounded p-3 mb-3">
                                <div className="fw-semibold mb-2">
                                    Add integer range
                                </div>

                                <div className="row g-2 align-items-end">
                                    <div className="col">
                                        <Form.Label className="small">
                                            Lower bound
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            step="1"
                                            value={
                                                lowerBound
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setLowerBound(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="e.g. 1"
                                        />
                                    </div>

                                    <div className="col">
                                        <Form.Label className="small">
                                            Upper bound
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            step="1"
                                            value={
                                                upperBound
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setUpperBound(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="e.g. 5"
                                        />
                                    </div>

                                    <div className="col-auto">
                                        <Button
                                            type="button"
                                            variant="outline-primary"
                                            onClick={
                                                addIntegerRange
                                            }
                                            disabled={
                                                !Number.isInteger(
                                                    Number(
                                                        lowerBound
                                                    )
                                                ) ||
                                                !Number.isInteger(
                                                    Number(
                                                        upperBound
                                                    )
                                                ) ||
                                                lowerBound ===
                                                    '' ||
                                                upperBound ===
                                                    ''
                                            }
                                        >
                                            Add range
                                        </Button>
                                    </div>
                                </div>

                                <div className="text-muted small mt-2">
                                    Adds every integer from
                                    the lower bound to the
                                    upper bound, including
                                    both bounds.
                                </div>
                            </div>
                        )}

                        {/* ------------------------------------- */}
                        {/* ARRAY TOOLBAR */}
                        {/* ------------------------------------- */}

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="text-muted small">
                                {arrayValue.length}{' '}
                                elements
                            </div>

                            <div className="d-flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline-danger"
                                    size="sm"
                                    disabled={
                                        arrayValue.length ===
                                        0
                                    }
                                    onClick={() => {
                                        const confirmed =
                                            window.confirm(
                                                'Are you sure you want to clear the entire array?'
                                            );

                                        if (confirmed) {
                                            updateArray(
                                                []
                                            );
                                            setNewRow(
                                                null
                                            );
                                        }
                                    }}
                                >
                                    Clear all
                                </Button>

                                <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    onClick={() =>
                                        startInsert(
                                            arrayValue.length
                                        )
                                    }
                                >
                                    + Add element
                                </Button>
                            </div>
                        </div>

                        {/* ------------------------------------- */}
                        {/* VIRTUALIZED TABLE */}
                        {/* ------------------------------------- */}

                        <div
                            ref={
                                scrollContainerRef
                            }
                            onScroll={handleScroll}
                            style={{
                                height: '60vh',
                                overflowY: 'auto',
                                border: '1px solid #dee2e6',
                            }}
                        >
                            <table
                                className="table table-bordered table-sm mb-0"
                                style={{
                                    width: '100%',
                                    tableLayout:
                                        'fixed',
                                }}
                            >
                                <thead
                                    className="table-light"
                                    style={{
                                        position:
                                            'sticky',
                                        top: 0,
                                        zIndex: 5,
                                    }}
                                >
                                    <tr
                                        style={{
                                            height: `${ROW_HEIGHT}px`,
                                        }}
                                    >
                                        <th
                                            style={{
                                                width: '90px',
                                                textAlign:
                                                    'center',
                                            }}
                                        >
                                            Index
                                        </th>

                                        <th>
                                            Value
                                        </th>

                                        <th
                                            style={{
                                                width: '100px',
                                            }}
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {topSpacerHeight >
                                        0 && (
                                        <tr
                                            style={{
                                                height: `${topSpacerHeight}px`,
                                            }}
                                        >
                                            <td
                                                colSpan={
                                                    3
                                                }
                                                style={{
                                                    padding: 0,
                                                    border: 0,
                                                }}
                                            />
                                        </tr>
                                    )}

                                    {visibleRows.map(
                                        (row) => {
                                            /*
                                             * NEW ROW
                                             */
                                            if (
                                                row.type ===
                                                'new'
                                            ) {
                                                return (
                                                    <tr
                                                        key={`new-${row.virtualIndex}`}
                                                        style={{
                                                            height: `${ROW_HEIGHT}px`,
                                                        }}
                                                    >
                                                        <td className="text-center align-middle bg-light">
                                                            {
                                                                row.arrayIndex
                                                            }
                                                        </td>

                                                        <td>
                                                            <Form.Control
                                                                ref={
                                                                    newRowInputRef
                                                                }
                                                                type="number"
                                                                step="any"
                                                                size="sm"
                                                                autoFocus
                                                                value={
                                                                    newRow?.value ??
                                                                    ''
                                                                }
                                                                placeholder="Enter value..."
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    const rawValue =
                                                                        event
                                                                            .target
                                                                            .value;

                                                                    setNewRow(
                                                                        (
                                                                            previous
                                                                        ) =>
                                                                            previous
                                                                                ? {
                                                                                      ...previous,
                                                                                      value: rawValue,
                                                                                  }
                                                                                : previous
                                                                    );

                                                                    handleNewRowChange(
                                                                        rawValue
                                                                    );
                                                                }}
                                                                onKeyDown={(
                                                                    event
                                                                ) => {
                                                                    if (
                                                                        event.key ===
                                                                        'Escape'
                                                                    ) {
                                                                        setNewRow(
                                                                            null
                                                                        );
                                                                    }
                                                                }}
                                                                onPaste={(
                                                                    event
                                                                ) =>
                                                                    handlePaste(
                                                                        event,
                                                                        row.arrayIndex
                                                                    )
                                                                }
                                                            />
                                                        </td>

                                                        <td className="text-center align-middle">
                                                            <Button
                                                                type="button"
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setNewRow(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                ×
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            }

                                            /*
                                             * EXISTING ROW
                                             */

                                            const index =
                                                row.arrayIndex;

                                            const item =
                                                arrayValue[
                                                    index
                                                ];

                                            return (
                                                <tr
                                                    key={index}
                                                    style={{
                                                        height: `${ROW_HEIGHT}px`,
                                                    }}
                                                >
                                                    <td className="text-center align-middle bg-light">
                                                        {
                                                            index
                                                        }
                                                    </td>

                                                    <td>
                                                        <Form.Control
                                                            id={`${name}-array-cell-${index}`}
                                                            type="number"
                                                            step="any"
                                                            size="sm"
                                                            value={formatValue(
                                                                item
                                                            )}
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateCell(
                                                                    index,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            onPaste={(
                                                                event
                                                            ) =>
                                                                handlePaste(
                                                                    event,
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td className="text-center align-middle">
                                                        <div className="d-flex justify-content-center gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() =>
                                                                    startInsert(
                                                                        index
                                                                    )
                                                                }
                                                                title="Insert element before this one"
                                                            >
                                                                +
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() =>
                                                                    deleteCell(
                                                                        index
                                                                    )
                                                                }
                                                                title="Delete element"
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}

                                    {bottomSpacerHeight >
                                        0 && (
                                        <tr
                                            style={{
                                                height: `${bottomSpacerHeight}px`,
                                            }}
                                        >
                                            <td
                                                colSpan={
                                                    3
                                                }
                                                style={{
                                                    padding: 0,
                                                    border: 0,
                                                }}
                                            />
                                        </tr>
                                    )}

                                    {arrayValue.length ===
                                        0 &&
                                        !newRow && (
                                            <tr>
                                                <td
                                                    colSpan={
                                                        3
                                                    }
                                                    className="text-center text-muted py-4"
                                                >
                                                    Empty
                                                    array
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-2 text-muted small">
                            Click <strong>+</strong> to
                            insert an element before that
                            position. Empty new elements
                            are not added.
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
);

ArrayInputControl.displayName =
    'ArrayInputControl';


/*
 * ----------------------------------------------------------
 * NUMBER PARSING
 * ----------------------------------------------------------
 */

function parseNumber(value) {
    if (typeof value !== 'string') {
        return value;
    }

    const trimmed = value.trim();

    if (trimmed === '') {
        return '';
    }

    const number = Number(trimmed);

    return Number.isFinite(number)
        ? number
        : null;
}


/*
 * ----------------------------------------------------------
 * DISPLAY FORMATTING
 * ----------------------------------------------------------
 */

function formatValue(value) {
    if (value === null) {
        return '';
    }

    if (value === undefined) {
        return '';
    }

    return String(value);
}

export default ArrayInputControl;