import React, { useState } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Table, Button, Form } from 'react-bootstrap';
import ViscoelasticMaterials from './ViscoelasticMaterials';
import DynamicStiffness from './DynamicStiffness';

const NeutralizerData = ({ control, errors, getValues, setValue, clearErrors }) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'neutralizers'
	})

	const rows = useWatch({ control, name: 'neutralizers' })

	const floatRules = {
		required: 'This field is required',
		pattern: {
			value: /^\d+(\.\d+)?$/,
			message: 'Please enter a valid number'
		}
	}

	const intRules = {
		required: 'This field is required',
		pattern: {
			value: /^[0-9]+$/,
			message: 'Please enter a valid number'
		}
	}

	const getRulesNatFreqLower = (rowIndex, isNatFreqEnabled) => {
		if (!isNatFreqEnabled) {
			return {
				required: false
			};
		}
		
		return {
			...floatRules,
			validate: (value) => {
				const upperBound = rows[rowIndex].natFreqUpper

				if (!value || !upperBound)
					return true
	
				return (parseFloat(upperBound) >= parseFloat(value)) 
					|| 'Value must be lower than Natural Frequency Upper Bound'
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
			...floatRules,
			validate: (value) => {
				const lowerBound = rows[rowIndex].natFreqLower

				if (!value || !lowerBound)
					return true

				return (parseFloat(lowerBound) <= parseFloat(value))
					|| 'Value must be higher than Natural Frequency Lower Bound'
			}
		}
	}

	const getRulesNatFreqDiscretization = (isNatFreqEnabled) => {
		if (!isNatFreqEnabled) {
			return {
				required: false
			};
		}

		return {
			...intRules
		}
	}		

	const getRulesDampingRatioLower = (rowIndex, isDampingEnabled) => {
		if (!isDampingEnabled) {
			return {
				required: false
			};
		}

		return {
			...floatRules,
			validate: (value) => {
				const upperBound = rows[rowIndex].dampingRatioUpper;

				if (!value || !upperBound)
					return true;

				return parseFloat(value) <= parseFloat(upperBound)
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
			...floatRules,
			validate: (value) => {
				const lowerBound = rows[rowIndex].dampingRatioLower;

				if (!value || !lowerBound)
					return true;

				return parseFloat(value) >= parseFloat(lowerBound)
					|| 'Value must be lower than Damping Ratio Upper Bound';
			}
		};
	};

	const getRulesDampingRatioDiscretization = (isDampingEnabled) => {
		if (!isDampingEnabled) {
			return {
				required: false
			};
		}

		return {
			...intRules
		}
	}

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

	const removeNeutralizers = () => {
		const currentRows = (rows || [])

		const indexesToRemove = currentRows
			.map((row, index) => (row?.checked ? index : -1))
			.filter(index => index !== -1)
			.sort((a, b) => b - a);

		indexesToRemove.forEach(index => remove(index))
	};

	const handleTypeChange = (e, fieldOnChange, rowIndex) => {
		const selectedValues = Array.from(
			e.target.selectedOptions,
			option => option.value
		);

		fieldOnChange(selectedValues)

		if (!selectedValues.includes('1') && !selectedValues.includes('2')) {
			setValue(`neutralizers.${rowIndex}.natFreqLower`, '')
			setValue(`neutralizers.${rowIndex}.natFreqUpper`, '')
			setValue(`neutralizers.${rowIndex}.natFreqDisc`, '')

			clearErrors([
				`neutralizers.${rowIndex}.natFreqLower`,
				`neutralizers.${rowIndex}.natFreqUpper`,
				`neutralizers.${rowIndex}.natFreqDisc`
			])
		}
		if (!selectedValues.includes('0')) {
			setValue(`neutralizers.${rowIndex}.dynamicStiffness`, '')

			clearErrors([
				`neutralizers.${rowIndex}.dynamicStiffness`
			])
		}

		if (!selectedValues.includes('2')) {
			setValue(`neutralizers.${rowIndex}.dampingRatioLower`, '');
			setValue(`neutralizers.${rowIndex}.dampingRatioUpper`, '');
			setValue(`neutralizers.${rowIndex}.dampingRatioDisc`, '');


			clearErrors([
				`neutralizers.${rowIndex}.dampingRatioLower`,
				`neutralizers.${rowIndex}.dampingRatioUpper`,
				`neutralizers.${rowIndex}.dampingRatioDisc`
			]);
		}

		if (!selectedValues.includes('1')) {
			setValue(`neutralizers.${rowIndex}.viscoelasticMaterial`, '');

			clearErrors([
				`neutralizers.${rowIndex}.viscoelasticMaterial`
			])
		}
	}


	return (
		<div>
			<div className="d-flex justify-content-between mb-3">
				<Button variant="primary" onClick={() => append({ checked: false, mass: '', types: [], natFreqLower: '', natFreqUpper: '', natFreqDisc: '', dampingRatioLower: '', dampingRatioUpper: '', dampingRatioDisc: '', viscoMaterial: '', dynamicStiff: '' })}>
					Add Neutralizer
				</Button>
				<Button
					variant="danger"
					disabled={!rows?.some((row) => row.checked)}
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
					{fields.map((row, index) => {
						const types = rows?.[index]?.types || [];
						const isNatFreqEnabled = types.includes('1') || types.includes('2');
						const isDampingEnabled = types.includes('2');
						const isViscoelasticEnabled = types.includes('1');
						const isDynamicStiffnessEnabled = types.includes('0');

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
										name={`neutralizers.${index}.mass`}
										control={control}
										rules={floatRules}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control {...field} type="text" placeholder="Mass" />
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.integer.`}
										control={control}
										defaultValue={['0']}
										render={({ field }) => (
											<Form.Control
												as="select"
												multiple
												value={field.value}
												onChange={(e) => handleTypeChange(e, field.onChange, index)}
											>
												<option value="0">User Defined Dynamic Stiffness</option>
												<option value="1">Viscoelastic</option>
												<option value="2">Viscous</option>
											</Form.Control>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.integer[1].range`}
										control={control}
										defaultValue=''
										render={({ field }) => (
											<Form.Control
												{...field}
												type="text"
												value={row.modalPosition}
												placeholder="[0,1,4,7]"
											/>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.natFreqLower`}
										control={control}
										rules={getRulesNatFreqLower(index, isNatFreqEnabled)}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control {...field} type="text" disabled={!isNatFreqEnabled} />
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.natFreqUpper`}
										control={control}
										rules={getRulesNatFreqUpper(index, isNatFreqEnabled)}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control {...field} type="text" disabled={!isNatFreqEnabled} />
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.natFreqDisc`}
										control={control}
										rules={getRulesNatFreqDiscretization(isNatFreqEnabled)}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control {...field} type="text" disabled={!isNatFreqEnabled} />
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.dampingRatioLower`}
										control={control}
										rules={getRulesDampingRatioLower(index, isDampingEnabled)}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control {...field} type="text" disabled={!isDampingEnabled} />
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.dampingRatioUpper`}
										control={control}
										rules={getRulesDampingRatioUpper(index, isDampingEnabled)}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control {...field} type="text" disabled={!isDampingEnabled} />
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.dampingRatioDisc`}
										control={control}
										rules={getRulesDampingRatioDiscretization(isDampingEnabled)}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control {...field} type="text" disabled={!isDampingEnabled} />
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.viscoelasticMaterial`}
										control={control}
										rules={getRulesViscoelasticMaterial(isViscoelasticEnabled)}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control
													{...field}
													type="text"
													placeholder="[Material1, Material2]"
													disabled={!isViscoelasticEnabled}
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
										name={`neutralizers.${index}.dynamicStiffness`}
										control={control}
										rules={getRulesDynamicStiffness(isDynamicStiffnessEnabled)}
										defaultValue=""
										render={({ field, fieldState }) => (
											<>
												<Form.Control
													{...field}
													type="text"
													placeholder="[Stiffness1, Stiffness2]"
													disabled={!isDynamicStiffnessEnabled}
												/>
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>


			<ViscoelasticMaterials control={control} errors={errors} getValues={getValues} />
			<DynamicStiffness />
		</div>
	);
};

export default NeutralizerData;