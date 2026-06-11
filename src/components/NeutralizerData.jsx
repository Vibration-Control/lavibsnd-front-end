import { useState, useRef } from "react";
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import ViscoelasticMaterials from './ViscoelasticMaterials';
import TemperatureDetuning from './TemperatureDetuning';
import DynamicStiffness from './DynamicStiffness';
import Plot from "react-plotly.js";

const getFieldPath = (arrayType, row, childName, rowIndex, property = '') => {
	const array = row?.optimizationVariables?.[arrayType] || [];
	const childIndex = array.findIndex(item => item.name === childName);
  console.log(`childIndex = ${childIndex} e row = `)
  console.log(row)
	if (childIndex === -1) return ''; // optionally throw error
	return property
		? `neutralizers.${rowIndex}.optimizationVariables.${arrayType}.${childIndex}.${property}`
		: `neutralizers.${rowIndex}.optimizationVariables.${arrayType}.${childIndex}`;
};

const NeutralizerData = ({ control, errors, getValues, setValue, clearErrors }) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'neutralizers'
	})
	const neutralizerRows = useWatch({ control, name: 'neutralizers' })

	const [showPlot, setShowPlot] = useState(false);

	const additionalParameters = useWatch({ control, name: 'additionalParameters' })

	const nodePositions = useWatch({
		control,
		name: "additionalParameters.PrimarySystemNodePositions",
	}) || [];

	const [selectedNodes, setSelectedNodes] = useState([]);
	const [selectedNeutralizer, setSelectedNeutralizer] = useState("");
	const [targetVariable, setTargetVariable] = useState("");
	const lastClickRef = useRef(0);
	const CLICK_COOLDOWN = 250; // milliseconds

	const createEmptyNeutralizer = () => ({
		mass: 0.0,
		massTypeUserDefined: true,
		optimizationVariables: {
			real: [
				{
					name: "frequency",
					lowerBound: '',
					upperBound: '',
					discretization: 1000
				},
				{
					name: "damp",
					lowerBound: '',
					upperBound: '',
					discretization: 1000
				},
				{
					name: "shape_factor",
					lowerBound: '',
					upperBound: '',
					discretization: 1000
				}
			],
			integer: [
				{
					name: "type",
					range: []
				},
				{
					name: "modal_position",
					range: []
				},
				{
					name: "modal_position_tip",
					range: []
				},
				{
					name: "viscoelastic_material",
					range: []
				},
        {
          name: "dynamic_stiffness",
          range: []
        }
			]
		}
	});

	const parseValue = (value) => {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? '' : parsed;
	};

	const rules = {
		required: 'This field is required',
		pattern: {
			value: /^\d+(\.\d+)?$/,
			message: 'Please enter a valid number'
		}
	}

	const getOptimizationVariableValue = (rows, rowIndex, arrayType, childName, property) => {
		const row = rows[rowIndex];
		if (!row?.optimizationVariables) return undefined;

		const array = row.optimizationVariables[arrayType] || [];
		const child = array.find(item => item.name === childName);
		if (!child) return undefined;

		return property ? child[property] : child;
	};

	const getRulesShapeFactorLower = (rowIndex, isShapeFactorEnabled) => {
		if (!isShapeFactorEnabled) {
			return {
				required: false
			};
		}

		return {
			...rules,
			validate: (value) => {
				const upperBound = getOptimizationVariableValue(neutralizerRows, rowIndex, 'real', 'shape_factor', 'upperBound');
				if (!value || !upperBound)
					return true

				return (parseFloat(upperBound) > parseFloat(value))
					|| 'Value must be lower than Shape Facor Upper Bound'
			}
		}
	}

	const getRulesNatFreqLower = (rowIndex, isNatFreqEnabled) => {
		if (!isNatFreqEnabled) {
			return {
				required: false
			};
		}

		return {
			...rules,
			validate: (value) => {
				const upperBound = getOptimizationVariableValue(neutralizerRows, rowIndex, 'real', 'frequency', 'upperBound');
				if (!value || !upperBound)
					return true

				return (parseFloat(upperBound) > parseFloat(value))
					|| 'Value must be lower than Natural Frequency Upper Bound'
			}
		}
	}

	const getRulesShapeFactorUpper = (rowIndex, isShapeFactorEnabled) => {
		if (!isShapeFactorEnabled) {
			return {
				required: false
			};
		}

		return {
			...rules,
			validate: (value) => {
				const lowerBound = getOptimizationVariableValue(neutralizerRows, rowIndex, 'real', 'shape_factor', 'lowerBound');

				if (!value || !lowerBound)
					return true

				return (parseFloat(lowerBound) < parseFloat(value))
					|| 'Value must be higher than Shape Factor Lower Bound'
			}
		}
	}

	const getRulesNatFreqUpper = (rowIndex, isNatFreqEnabled) => {
		if (!isNatFreqEnabled) {
			return {
				required: false
			};
		}

		return {
			...rules,
			validate: (value) => {
				const lowerBound = getOptimizationVariableValue(neutralizerRows, rowIndex, 'real', 'frequency', 'lowerBound')

				if (!value || !lowerBound)
					return true

				return (parseFloat(lowerBound) < parseFloat(value))
					|| 'Value must be higher than Natural Frequency Lower Bound'
			}
		}
	}

	const getRulesDampingRatioLower = (rowIndex, isDampingEnabled) => {
		if (!isDampingEnabled) {
			return {
				required: false
			};
		}

		return {
			...rules,
			validate: (value) => {
				const upperBound = getOptimizationVariableValue(neutralizerRows, rowIndex, 'real', 'damp', 'upperBound')

				if (!value || !upperBound)
					return true;

				return parseFloat(value) < parseFloat(upperBound)
					|| 'Value must be lower than Damping Ratio Upper Bound';
			}
		};
	};

	const getRulesDampingRatioUpper = (rowIndex, isDampingEnabled) => {
		if (!isDampingEnabled) {
			return {
				required: false
			};
		}

		return {
			...rules,
			validate: (value) => {
				const lowerBound = getOptimizationVariableValue(neutralizerRows, rowIndex, 'real', 'damp', 'lowerBound')


				if (!value || !lowerBound)
					return true;

				return parseFloat(value) > parseFloat(lowerBound)
					|| 'Value must be lower than Damping Ratio Upper Bound';
			}
		};
	};

	const getRulesViscoelasticMaterial = (isViscoelasticEnabled) => {
		if (!isViscoelasticEnabled) {
			return {
				required: false
			};
		}

		return {
			required: 'This field is required'
		}
	}

	const getRulesDynamicStiffness = (isDynamicStiffnessEnabled) => {
		if (!isDynamicStiffnessEnabled) {
			return {
				required: false
			};
		}

		return {
			required: 'This field is required'
		}
	}

	const removeSelectedRows = () => {
		const currentNeutralizerRows = (neutralizerRows || [])

		const indexesToRemove = currentNeutralizerRows
			.map((row, index) => (row?.checked ? index : -1))
			.filter(index => index !== -1)
			.sort((a, b) => b - a);

		indexesToRemove.forEach(index => remove(index))
	};

	const handleTypeChange = (e, fieldOnChange, row, rowIndex) => {
		const selectedValues = Array.from(
			e.target.selectedOptions,
			option => Number(option.value)
		);

		fieldOnChange(selectedValues);

		if (!selectedValues.includes(1) && !selectedValues.includes(2)) {
			setValue(`neutralizers.${rowIndex}.optimizationVariables.real[0].lowerBound`, '');
			setValue(`neutralizers.${rowIndex}.optimizationVariables.real[0].upperBound`, '');
			clearErrors([
				`neutralizers.${rowIndex}.optimizationVariables.real[0].lowerBound`,
				`neutralizers.${rowIndex}.optimizationVariables.real[0].upperBound`,
			]);
		}

		if (!selectedValues.includes(0)) {
			setValue(`neutralizers.${rowIndex}.dynamicStiffness`, '');
			clearErrors([
				`neutralizers.${rowIndex}.dynamicStiffness`
			]);
		}

		if (!selectedValues.includes(2)) {
			setValue(`neutralizers.${rowIndex}.optimizationVariables.real[1].lowerBound`, '');
			setValue(`neutralizers.${rowIndex}.optimizationVariables.real[1].upperBound`, '');
			clearErrors([
				`neutralizers.${rowIndex}.optimizationVariables.real[1].lowerBound`,
				`neutralizers.${rowIndex}.optimizationVariables.real[1].upperBound`,
			]);
		}

		if (!selectedValues.includes(1)) {
			setValue(`neutralizers.${rowIndex}.viscoelasticMaterial`, '');
			clearErrors([
				`neutralizers.${rowIndex}.viscoelasticMaterial`
			]);
		}
	};

	const parseRange = (range) => {
		if (!range) return [];
		if (Array.isArray(range)) return range.map(Number);
		try {
			return JSON.parse(range).map(Number);
		} catch {
			return [];
		}
	};

	const handlePointClick = (event) => {

		if (!event?.points?.length) return;

		const now = Date.now();

		// Ignore clicks during cooldown
		if (now - lastClickRef.current < CLICK_COOLDOWN) return;

		lastClickRef.current = now;

		const nodeNumber = event.points[0].customdata;

		setSelectedNodes(prev => {

			// If already selected → remove it
			if (prev.includes(nodeNumber)) {
				return prev.filter(n => n !== nodeNumber);
			}

			// Otherwise add it
			return [...prev, nodeNumber];
		});
	};

	const assignNodes = () => {

    if (!selectedNodes.length) return;

		const path = `neutralizers.${selectedNeutralizer}.optimizationVariables.integer`;

		const vars = getValues(path) || [];

		const idx = vars.findIndex(v => v.name === targetVariable);

		if (idx === -1) return;

		const currentRange = vars[idx].range || [];

		const parsedCurrent =
			Array.isArray(currentRange)
				? currentRange
				: JSON.parse(currentRange || "[]");

		const updatedRange = JSON.stringify(
			[...new Set([...parsedCurrent, ...selectedNodes])]
		);
		setValue(`${path}.${idx}.range`, updatedRange);

		setSelectedNodes([]);
	};

	return (
		<div>
			<div className="d-flex justify-content-between mb-3">
				<Button variant="primary" onClick={() => append(createEmptyNeutralizer())}>
					Add Neutralizer
				</Button>
				<Button
					variant="danger"
					disabled={!neutralizerRows?.some((row) => row.checked)}
					onClick={removeSelectedRows}
				>
					Remove Neutralizers
				</Button>
			</div>
			<div style={{ overflowX: 'auto' }}>
				<Table
					striped
					bordered
					hover
					style={{ minWidth: '1600px' }}
				>
					<thead>
						<tr>
							<th style={{ minWidth: '50px' }}>Select</th>
							<th style={{ minWidth: '160px' }}>Mass Type</th>
							<th style={{ minWidth: '100px' }}>Mass</th>
							<th style={{ minWidth: '200px' }}>Neutralizer Type</th>
							<th style={{ minWidth: '100px' }}>Modal Position</th>
							<th style={{ minWidth: '100px' }}>Modal Position Tip (Link)</th>
							<th style={{ minWidth: '100px' }}>Natural Frequency Lower Bound</th>
							<th style={{ minWidth: '100px' }}>Natural Frequency Upper Bound</th>
							<th style={{ minWidth: '100px' }}>Damping Ratio Lower Bound</th>
							<th style={{ minWidth: '100px' }}>Damping Ratio Upper Bound</th>
							<th style={{ minWidth: '100px' }}>Shape Factor Lower Bound</th>
							<th style={{ minWidth: '100px' }}>Shape Factor Upper Bound</th>
							<th style={{ minWidth: '200px' }}>Viscoelastic Material</th>
							<th style={{ minWidth: '200px' }}>Dynamic Stiffness</th>
						</tr>
					</thead>
					<tbody>
						{fields.map((row, index) => {
							const types =
								neutralizerRows?.[index]?.optimizationVariables?.integer?.find(
									(i) => i.name === "type"
								)?.range || [];
							const isModalPositionTipEnabled = types.includes(4)
							const isShapeFactorEnabled = types.includes(3) || types.includes(4)
							const isNatFreqEnabled = types.includes(1) || types.includes(2)
							const isDampingEnabled = types.includes(2)
							const isViscoelasticEnabled = types.includes(1) || types.includes(3) || types.includes(4)
							const isDynamicStiffnessEnabled = types.includes(0);

							return (
								<tr key={row.id}>
									<td>
										<Controller
											name={`neutralizers.${index}.checked`}
											control={control}
											defaultValue={false}
											render={({ field }) => <Form.Check {...field} checked={field.value} />}
										/>
									</td>
									<td>
										<Controller
											name={`neutralizers.${index}.massTypeUserDefined`}
											control={control}
											defaultValue={true}
											render={({ field }) => (
												<div>
													<Form.Check
														inline
														type="radio"
														label="User Defined"
														checked={field.value === true}
														onChange={() => field.onChange(true)}
													/>
													<Form.Check
														inline
														type="radio"
														label="Mode Relationship"
														checked={field.value === false}
														onChange={() => field.onChange(false)}
													/>
												</div>
											)}
										/>
									</td>
									<td>
										<Controller
											name={`neutralizers.${index}.mass`}
											control={control}
											rules={rules}
											defaultValue=""
											render={({ field, fieldState }) => (
												<>
													<Form.Control
														{...field}
														type="number"
														placeholder="Mass"
														onChange={(e) => field.onChange(parseValue(e.target.value))}
													/>
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('integer', row, 'type', index, 'range')}
											control={control}
											rules={rules}
											defaultValue='[0]'
											render={({ field, fieldState }) => (
												<>
													<Form.Control
														as="select"
														multiple
														value={field.value}
														onChange={(e) => handleTypeChange(e, field.onChange, row, index)}
													>
														<option value='0'>User Defined Dynamic Stiffness</option>
														<option value='1'>Viscoelastic</option>
														<option value='2'>Viscous</option>
														<option value='3'>Viscoelastic Link to ground</option>
														<option value='4'>Viscoelastic Link

														</option>
													</Form.Control>
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('integer', row, 'modal_position', index, 'range')}
											control={control}
											defaultValue=''
											render={({ field, fieldState }) => (
												<>
													<Form.Control {...field} type="text" placeholder="[0,1,4,7]" />
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('integer', row, 'modal_position_tip', index, 'range')}
											control={control}
											defaultValue=''
											render={({ field, fieldState }) => (
												<>
													<Form.Control {...field} type="text" disabled={!isModalPositionTipEnabled} placeholder="[0,1,4,7]" />
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('real', row, 'frequency', index, 'lowerBound')}
											control={control}
											rules={getRulesNatFreqLower(index, isNatFreqEnabled)}
											defaultValue=""
											render={({ field, fieldState }) => (
												<>
													<Form.Control
														{...field}
														type="number"
														disabled={!isNatFreqEnabled}
														onChange={(e) => field.onChange(parseValue(e.target.value))}
													/>
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('real', row, 'frequency', index, 'upperBound')}
											control={control}
											rules={getRulesNatFreqUpper(index, isNatFreqEnabled)}
											defaultValue=""
											render={({ field, fieldState }) => (
												<>
													<Form.Control
														{...field}
														type="number"
														disabled={!isNatFreqEnabled}
														onChange={(e) => field.onChange(parseValue(e.target.value))}
													/>
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('real', row, 'damp', index, 'lowerBound')}
											control={control}
											rules={getRulesDampingRatioLower(index, isDampingEnabled)}
											defaultValue=""
											render={({ field, fieldState }) => (
												<>
													<Form.Control
														{...field}
														type="number"
														disabled={!isDampingEnabled}
														onChange={(e) => field.onChange(parseValue(e.target.value))}
													/>
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('real', row, 'damp', index, 'upperBound')}
											control={control}
											rules={getRulesDampingRatioUpper(index, isDampingEnabled)}
											defaultValue=""
											render={({ field, fieldState }) => (
												<>
													<Form.Control
														{...field}
														type="number"
														disabled={!isDampingEnabled}
														onChange={(e) => field.onChange(parseValue(e.target.value))}
													/>
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('real', row, 'shape_factor', index, 'lowerBound')}
											control={control}
											rules={getRulesShapeFactorLower(index, isShapeFactorEnabled)}
											defaultValue=""
											render={({ field, fieldState }) => (
												<>
													<Form.Control
														{...field}
														type="number"
														disabled={!isShapeFactorEnabled}
														onChange={(e) => field.onChange(parseValue(e.target.value))}
													/>
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={getFieldPath('real', row, 'shape_factor', index, 'upperBound')}
											control={control}
											rules={getRulesShapeFactorUpper(index, isShapeFactorEnabled)}
											defaultValue=""
											render={({ field, fieldState }) => (
												<>
													<Form.Control
														{...field}
														type="number"
														disabled={!isShapeFactorEnabled}
														onChange={(e) => field.onChange(parseValue(e.target.value))}
													/>
													{fieldState.error && (
														<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
													)}
												</>
											)}
										/>
									</td>
									<td>
										<Controller
											name={
												getFieldPath(
													'integer',
													row,
													'viscoelastic_material',
													index,
													'range'
												) || `neutralizers.${index}.optimizationVariables.integer`
											}
											control={control}
											rules={getRulesViscoelasticMaterial(isViscoelasticEnabled)}
											defaultValue={[]}
											render={({ field, fieldState }) => {
												const selectedValues = Array.isArray(field.value)
													? field.value.map(String)
													: [];

												return (
													<>
														<Form.Control
															as="select"
															multiple
															disabled={!isViscoelasticEnabled}
															value={selectedValues}
															onChange={(e) => {
																const selectedIndexes = Array.from(
																	e.target.selectedOptions,
																	(option) => Number(option.value)
																);

																const path = getFieldPath(
																	'integer',
																	row,
																	'viscoelastic_material',
																	index,
																	'range'
																);

																// Normal case
																if (path) {
																	field.onChange(selectedIndexes);
																	return;
																}

																// Object does not exist → create it
																const integerPath = `neutralizers.${index}.optimizationVariables.integer`;

																const currentArray = getValues(integerPath) || [];

																const newViscoelasticMaterial = {
																	name: "viscoelastic_material",
																	range: selectedIndexes
																};

																setValue(integerPath, [...currentArray, newViscoelasticMaterial], {
																	shouldDirty: true,
																	shouldValidate: true
																});
															}}
														>
															{additionalParameters.viscoelasticMaterials.map((material, i) => (
																<option key={i} value={String(i)}>
																	{material.name}
																</option>
															))}
														</Form.Control>

														{fieldState.error && (
															<Form.Text className="text-danger">
																{fieldState.error.message}
															</Form.Text>
														)}
													</>
												);
											}}
										/>
									</td>

									<td>
										<Controller
											name={
												getFieldPath(
													'integer',
													row,
													'dynamic_stiffness',
													index,
													'range'
												) || `neutralizers.${index}.optimizationVariables.integer`
											}
											control={control}
											defaultValue={[]}
											render={({ field, fieldState }) => {
												const selectedValues = Array.isArray(field.value)
													? field.value.map(String)
													: [];

												return (
													<>
														<Form.Control
															as="select"
															multiple
															disabled={!isDynamicStiffnessEnabled}
															value={selectedValues}
															onChange={(e) => {
																const selectedIndexes = Array.from(
																	e.target.selectedOptions,
																	(option) => Number(option.value)
																);

																const path = getFieldPath(
																	'integer',
																	row,
																	'dynamic_stiffness',
																	index,
																	'range'
																);

																// Normal case (object already exists)
																if (path) {
																	field.onChange(selectedIndexes);
																	return;
																}

																// Object does not exist → create it
																const integerPath = `neutralizers.${index}.optimizationVariables.integer`;

																const currentArray = getValues(integerPath) || [];

																const newDynamicStiffness = {
																	name: "dynamic_stiffness",
																	range: selectedIndexes
																};

																setValue(integerPath, [...currentArray, newDynamicStiffness], {
																	shouldDirty: true,
																	shouldValidate: true
																});
															}}
														>
															{additionalParameters.userDefinedDynamicStiffnesses.map((stiffness, i) => (
																<option key={i} value={String(i)}>
																	{stiffness.name}
																</option>
															))}
														</Form.Control>

														{fieldState.error && (
															<Form.Text className="text-danger">
																{fieldState.error.message}
															</Form.Text>
														)}
													</>
												);
											}}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</div>

			{/* ===== PLOT STRUCTURE GEOMETRY BUTTON ===== */}
			<div className="mt-4">
				<Button
					variant="secondary"
					disabled={
						!getValues("additionalParameters.PrimarySystemNodePositions") ||
						getValues("additionalParameters.PrimarySystemNodePositions").length === 0
					}
					onClick={() => setShowPlot(true)}
				>
					Plot Structure Geometry
				</Button>
			</div>

			<Modal show={showPlot} onHide={() => setShowPlot(false)} size="lg">

				<Modal.Header closeButton>
					<Modal.Title>Structure Geometry</Modal.Title>
				</Modal.Header>

				<Modal.Body>

					<Plot
						onClick={handlePointClick}
						data={[

							/* ===== BASE STRUCTURE NODES ===== */

							{
								x: nodePositions.map(p => p[1]),
								y: nodePositions.map(p => p[2]),
								z: nodePositions.map(p => p[3]),
								customdata: nodePositions.map(p => p[0]),

								hovertemplate:
									"Node %{customdata}<br>X: %{x}<br>Y: %{y}<br>Z: %{z}<extra></extra>",

								mode: "markers",
								type: "scatter3d",
								name: "Structure Nodes",

								marker: {
									size: 3,
									color: "#419b6ee8"
								}
							},

							/* ===== SELECTED NODES ===== */

							{
								x: nodePositions
									.filter(p => selectedNodes.includes(p[0]))
									.map(p => p[1]),

								y: nodePositions
									.filter(p => selectedNodes.includes(p[0]))
									.map(p => p[2]),

								z: nodePositions
									.filter(p => selectedNodes.includes(p[0]))
									.map(p => p[3]),

								customdata: nodePositions
									.filter(p => selectedNodes.includes(p[0]))
									.map(p => p[0]),

								mode: "markers",
								type: "scatter3d",
								name: "Selected Nodes",

								marker: {
									size: 8,
									color: "#ffd000",
									symbol: "diamond"
								}
							},

							/* ===== NEUTRALIZER POSITIONS ===== */

							...(neutralizerRows || []).flatMap((neutralizer, nIdx) => {

								const integerVars =
									neutralizer.optimizationVariables?.integer || [];

								const modalPos =
									integerVars.find(v => v.name === "modal_position")?.range;

								const modalPosTip =
									integerVars.find(v => v.name === "modal_position_tip")?.range;

								const modalNodes = parseRange(modalPos);
								const tipNodes = parseRange(modalPosTip);

								const modalSelected = nodePositions.filter(p =>
									modalNodes.includes(p[0])
								);

								const tipSelected = nodePositions.filter(p =>
									tipNodes.includes(p[0])
								);

								return [

									/* Modal Position */

									{
										x: modalSelected.map(p => p[1]),
										y: modalSelected.map(p => p[2]),
										z: modalSelected.map(p => p[3]),

										customdata: modalSelected.map(p => p[0]),

										mode: "markers",
										type: "scatter3d",

										name: `Neutralizer ${nIdx + 1} Modal Position`,

										marker: {
											size: 6,
											color: "#ff5733"
										}
									},

									/* Modal Position Tip */

									{
										x: tipSelected.map(p => p[1]),
										y: tipSelected.map(p => p[2]),
										z: tipSelected.map(p => p[3]),

										customdata: tipSelected.map(p => p[0]),

										mode: "markers",
										type: "scatter3d",

										name: `Neutralizer ${nIdx + 1} Modal Position Tip`,

										marker: {
											size: 6,
											color: "#33c3ff"
										}
									}
								];
							})

						]}

						layout={{
							autosize: true,
							height: 600,

							title: "3D Structure Nodes",

							showlegend: true,

							legend: {
								x: 1,
								y: 1
							},

							scene: {
								xaxis: { title: "X" },
								yaxis: { title: "Y" },
								zaxis: { title: "Z" }
							}
						}}

						style={{ width: "100%", height: "100%" }}
					/>

					{/* ===== NODE ASSIGNMENT UI ===== */}

					<div className="mt-3 d-flex gap-2">

						<Form.Select
							value={selectedNeutralizer}
							onChange={e => setSelectedNeutralizer(e.target.value)}
							disabled={!selectedNodes.length}
						>

							<option value="">Select Neutralizer</option>

							{neutralizerRows.map((_, i) => (
								<option key={i} value={i}>
									Neutralizer {i + 1}
								</option>
							))}

						</Form.Select>


						<Form.Select
							value={targetVariable}
							onChange={e => setTargetVariable(e.target.value)}
							disabled={!selectedNodes.length}
						>

							<option value="">Assign To</option>
							<option value="modal_position">
								Modal Position
							</option>
							<option value="modal_position_tip">
								Modal Position Tip (Link)
							</option>

						</Form.Select>


						<Button
							disabled={
								!selectedNodes.length ||
								selectedNeutralizer === "" ||
								!targetVariable
							}
							onClick={assignNodes}
						>

							Add Selected Nodes

						</Button>

					</div>

				</Modal.Body>

			</Modal>


			<ViscoelasticMaterials control={control} errors={errors} getValues={getValues} />
			<TemperatureDetuning control={control} setValue={setValue} />
			<DynamicStiffness control={control} setValue={setValue} getValues={getValues} />
		</div>
	);
};

export default NeutralizerData;
export { getFieldPath };