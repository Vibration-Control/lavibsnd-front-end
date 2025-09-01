import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Table, Button, Form } from 'react-bootstrap';
import ViscoelasticMaterials from './ViscoelasticMaterials';
import TemperatureDetuning from './TemperatureDetuning';
import DynamicStiffness from './DynamicStiffness';

const NeutralizerData = ({ control, errors, getValues, setValue, clearErrors }) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'neutralizers'
	})

	const neutralizerRows = useWatch({ control, name: 'neutralizers' })

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
					name: "viscoelastic_material",
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

	const getRulesNatFreqLower = (rowIndex, isNatFreqEnabled) => {
		if (!isNatFreqEnabled) {
			return {
				required: false
			};
		}

		return {
			...rules,
			validate: (value) => {
				const upperBound = neutralizerRows[rowIndex].optimizationVariables.real[0].upperBound

				if (!value || !upperBound)
					return true

				return (parseFloat(upperBound) > parseFloat(value))
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
			...rules,
			validate: (value) => {
				const lowerBound = neutralizerRows[rowIndex].optimizationVariables.real[0].lowerBound

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
				const upperBound = neutralizerRows[rowIndex].optimizationVariables.real[1].upperBound

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
				const lowerBound = neutralizerRows[rowIndex].optimizationVariables.real[1].lowerBound 

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

	const removeSelectedNeutralizers = () => {
		const currentNeutralizerRows = (neutralizerRows || [])

		const indexesToRemove = currentNeutralizerRows
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
			setValue(`neutralizers.${rowIndex}.optimizationVariables.real[0].lowerBound`, '')
			setValue(`neutralizers.${rowIndex}.optimizationVariables.real[0].upperBound`, '')
			clearErrors([
				`neutralizers.${rowIndex}.optimizationVariables.real[0].lowerBound`,
				`neutralizers.${rowIndex}.optimizationVariables.real[0].upperBound`,
			])
		}

		if (!selectedValues.includes('0')) {
			setValue(`neutralizers.${rowIndex}.dynamicStiffness`, '')
			clearErrors([
				`neutralizers.${rowIndex}.dynamicStiffness`
			])
		}

		if (!selectedValues.includes('2')) {
			setValue(`neutralizers.${rowIndex}.optimizationVariables.real[1].lowerBound`, '');
			setValue(`neutralizers.${rowIndex}.optimizationVariables.real[1].upperBound`, '');
			clearErrors([
				`neutralizers.${rowIndex}.optimizationVariables.real[1].lowerBound`,
				`neutralizers.${rowIndex}.optimizationVariables.real[1].upperBound`,
			]);
		}

		if (!selectedValues.includes('1')) {
			setValue(`neutralizers[.${rowIndex}.viscoelasticMaterial`, '');
			clearErrors([
				`neutralizers[.${rowIndex}.viscoelasticMaterial`
			])
		}
	}


	return (
		<div>
			<div className="d-flex justify-content-between mb-3">
				<Button variant="primary" onClick={() => append(createEmptyNeutralizer())}>
					Add Neutralizer
				</Button>
				<Button
					variant="danger"
					disabled={!neutralizerRows?.some((row) => row.checked)}
					onClick={removeSelectedNeutralizers}
				>
					Remove Neutralizers
				</Button>
			</div>

			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Select</th>
						<th>Mass Type</th>
						<th>Mass</th>
						<th>Neutralizer Type</th>
						<th>Modal Position</th>
						<th>Natural Frequency Lower Bound</th>
						<th>Natural Frequency Upper Bound</th>
						<th>Damping Ratio Lower Bound</th>
						<th>Damping Ratio Upper Bound</th>
						<th>Viscoelastic Material</th>
						<th>Dynamic Stiffness</th>
					</tr>
				</thead>
				<tbody>
					{fields.map((row, index) => {
						const types = neutralizerRows?.[index]?.optimizationVariables.integer[0].range || [];
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
										name={`neutralizers.${index}.optimizationVariables.integer[0].range`}
										control={control}
										rules={rules}
										defaultValue='[0]'
										render={({ field, fieldState }) => (
											<>
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
												{fieldState.error && (
													<Form.Text className="text-danger">{fieldState.error.message}</Form.Text>
												)}
											</>
										)}
									/>
								</td>
								<td>
									<Controller
										name={`neutralizers.${index}.optimizationVariables.integer[1].range`}
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
										name={`neutralizers.${index}.optimizationVariables.real[0].lowerBound`}
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
										name={`neutralizers.${index}.optimizationVariables.real[0].upperBound`}
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
										name={`neutralizers.${index}.optimizationVariables.real[1].lowerBound`}
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
										name={`neutralizers.${index}.optimizationVariables.real[1].upperBound`}
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
										name={`neutralizers[.${index}.viscoelasticMaterial`}
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
										name={`neutralizers[.${index}.dynamicStiffness`}
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
			<TemperatureDetuning control={control} errors={errors} getValues={getValues} />
			<DynamicStiffness />
		</div>
	);
};

export default NeutralizerData;