import React from 'react'
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Table, Button, Form } from 'react-bootstrap';

const PrimarySystemData = ({ control, errors, unregister }) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'primarySystemData.rows'
	})

	const rows = useWatch({ control, name: 'primarySystemData.rows' })

	const rules = {
		required: 'This field is required',
		pattern: {
			value: /^\d+(\.\d+)?$/,
			message: 'Please enter a valid number'
		},
	}

	const removeSelectedRows = () => {
		const currentRows = (rows || [])

		const indexesToRemove = currentRows
			.map((row, index) => (row?.checked ? index : -1))
			.filter(index => index !== -1)
			.sort((a, b) => b - a);

		indexesToRemove.forEach(index => remove(index));
	};

	return (
		<div>
			<div className="d-flex justify-content-between mb-3">
				<Button variant="primary" onClick={() => append({ checked: false, naturalFrequency: '', modalDamping: '', modes: '' })}>
					Add Row
				</Button>
				<Button
					variant="danger"
					onClick={removeSelectedRows}
					disabled={!rows?.some((row) => row.checked)}
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
					{fields.map((row, index) => (
						<tr key={row.id}>
							<td>
								<Controller
									name={`primarySystemData.rows.${index}.checked`}
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
									name={`primarySystemData.rows.${index}.naturalFrequency`}
									control={control}
									rules={rules}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
												type='text'
												placeholder='e.g. 1.0'
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
									name={`primarySystemData.rows.${index}.modalDamping`}
									control={control}
									rules={rules}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
												type='text'
												placeholder='e.g. 0.05'
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
									name={`primarySystemData.rows.${index}.modes`}
									control={control}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
												type="text"
												//value={JSON.stringify(row.modes)}
												//onChange={(e) => handleModesChange(row.id, e.target.value)}
												placeholder='e.g. [0, 1, 2]'
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
		</div>
	);
}

export default PrimarySystemData;