import React, { useEffect } from 'react'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Table, Button, Form } from 'react-bootstrap';
import PrimarySystemChart from './PrimarySystemChart'
import ArrayInputControl from '../atom/ArrayInputControl';

const PrimarySystemData = ({ control, setValue }) => {
	const { fields: checkFields, append: appendCheck, remove: removeCheck } = useFieldArray({
		control,
		name: 'primarySystemChecks'
	})

	const checks = (useWatch({ control, name: 'primarySystemChecks' }) || [])
	const naturalFrequencies = (useWatch({ control, name: 'primarySystemNaturalFrequencies' }) || [])
	const modalDamping = (useWatch({ control, name: 'primarySystemModalDamping' }) || [])
	const modes = (useWatch({ control, name: 'primarySystemModes' }) || [])

	useEffect(() => {
		const maxLength = Math.max(naturalFrequencies.length, modalDamping.length, modes.length)

		if ((!checks) || (checks.length < maxLength)) {
			const newChecks = Array(maxLength).fill().map((_, index) => checks?.[index] || { value: false })

			setValue('primarySystemChecks', newChecks)
		}
	}, [checks, naturalFrequencies.length, modalDamping.length, modes.length, setValue])

	const rules = {
		required: 'This field is required',
		pattern: {
			value: /^\d+(\.\d+)?$/,
			message: 'Please enter a valid number'
		},
	}

	const modesRules = {
		required: 'This field is required',
		validate: (modes) => {
			let modesArray
			if (Array.isArray(modes)) {
				modesArray = modes
			} else {
				modesArray = modes.split(',')
			}

			return modesArray.every(mode => !isNaN(mode)) || "Values must be numbers"
		}
	}
	const parseValue = (value) => {
		const parsed = parseFloat(value);
		return isNaN(parsed) ? '' : parsed;
	};

	const removeSelectedRows = () => {
		const newChecks = [...checks]
		const newNaturalFrequencies = [...naturalFrequencies]
		const newModalDamping = [...modalDamping]
		const newModes = [...modes]

		const filteredChecks = newChecks.filter((_, index) => !checks[index]?.value)
		const filteredNaturalFrequencies = newNaturalFrequencies.filter((_, index) => !checks[index]?.value)
		const filteredModalDamping = newModalDamping.filter((_, index) => !checks[index]?.value)
		const filteredModes = newModes.filter((_, index) => !checks[index]?.value)

		setValue('primarySystemChecks', filteredChecks)
		setValue('primarySystemNaturalFrequencies', filteredNaturalFrequencies)
		setValue('primarySystemModalDamping', filteredModalDamping)
		setValue('primarySystemModes', filteredModes)
	};

	const appendEmptyRow = () => {
		appendCheck({ value: false })
		setValue('primarySystemNaturalFrequencies', [...naturalFrequencies, ''])
		setValue('primarySystemModalDamping', [...modalDamping, ''])
		setValue('primarySystemModes', [...modes, ''])
	}

	return (
		<div>
			<div className="d-flex justify-content-between mb-3">
				<Button variant="primary" onClick={() => appendEmptyRow()}>
					Add Row
				</Button>
				<Button
					variant="danger"
					onClick={removeSelectedRows}
					disabled={!checks?.some((check) => check.value)}
				>
					Remove Selected Rows
				</Button>
			</div>

			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Select</th>
						<th>Natural Frequency</th>
						<th>Modal Damping</th>
						<th>Mode</th>
					</tr>
				</thead>
				<tbody>
					{checkFields.map((checkField, index) => (
						<tr key={checkField.id}>
							<td>
								<Controller
									name={`primarySystemChecks.${index}.value`}
									control={control}
									defaultValue={false}
									render={({ field }) => (
										<Form.Check
											{...field}
											checked={field.value}
										/>
									)}
								/>
							</td>
							<td>
								<Controller
									name={`primarySystemNaturalFrequencies.${index}`}
									control={control}
									rules={rules}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
												type='number'
												placeholder='e.g. 1.0'
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
									name={`primarySystemModalDamping.${index}`}
									control={control}
									rules={rules}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
												type='number'
												placeholder='e.g. 0.05'
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
									name={`primarySystemModes.${index}`}
									control={control}
									rules={modesRules}
									defaultValue=""
									render={({ field, fieldState }) => (
										<>
											<ArrayInputControl
												{...field}
												placeholder="e.g. [0, 1, 2]"
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
						</tr>
					))}
				</tbody>
			</Table>

			<PrimarySystemChart
				control={control}
				setValue={setValue}
			/>
		</div>
	);
}

export default PrimarySystemData;