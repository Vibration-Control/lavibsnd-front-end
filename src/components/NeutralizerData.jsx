import React, { useState } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Table, Button, Form } from 'react-bootstrap';
import ViscoelasticMaterials from './ViscoelasticMaterials';
import DynamicStiffness from './DynamicStiffness';

const NeutralizerData = ({ control, errors, getValues}) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'neutralizerData.rows'
	})

	const rows = useWatch({ control, name:'neutralizerData.rows'})

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

	const getRulesNaturalFreqLowerBound = (rowId) => ({
		...floatRules,
		validate: (value) => {
			const upperBound = getValues(`neutralizerData.naturalFrequencyUpperBound[${rowId}]`)
			
			if (!value || !upperBound)
				return true
	
			return parseFloat(value) < parseFloat(upperBound)
				|| 'Value must be lower than Natural Frequency Upper Bound`'
		}
	})

	const getRulesNaturalFreqUpperBound = (rowId) => ({
		...floatRules,
		validate: (value) => {
			const lowerBound = getValues(`neutralizerData.naturalFrequencyLowerBound[${rowId}]`)
		
			if (!value || !lowerBound)
				return true

			return (parseFloat(lowerBound) < parseFloat(value)) 
				|| 'Value must be higher than Natural Frequency Lower Bound'
		}
	})

	const getRulesDampingRatioLowerBound = (rowId) => ({
		...floatRules,
		validate: (value) => {
			const upperBound = getValues(`neutralizerData.dampingRatioUpperBound[${rowId}]`) 

			if (!value || !upperBound)
					return true

			return (parseFloat(value) < parseFloat(upperBound)) 
				|| 'Value must be lower than Damping Ratio Upper Bound'
		}
	})

	const getRulesDampingRatioUpperBound = (rowId) => ({
		...floatRules,
		validate: (value) => {
			const lowerBound = getValues(`neutralizerData.dampingRatioLowerBound[${rowId}]`) 

			if (!value || !lowerBound)
					return true

			return (parseFloat(lowerBound) < parseFloat(value)) 
				|| 'Value must be higher than Damping Ratio Lower Bound'
		}
	})

  const removeNeutralizers = () => {
		const currentRows = (rows || [])

		const indexesToRemove = currentRows
			.map((row, index) => (row?.checked ? index : -1))
			.filter(index => index !== -1)
			.sort((a,b) => b - a);

		indexesToRemove.forEach(index => remove(index))
	};

  return (
    <div>
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => append({ checked:false, mass:'', type:[], natFreqLower:'', natFreqUpper:'', natFreqDisc:'', dampingRatioLower:'', dampingRatioUpper:'', dampingRatioDisc:'',viscoMaterial:'', dynamicStiff:''})}>
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
          {fields.map((row, index) => (
            <tr key={row.id}>
              <td>
								<Controller
									name={`neutralizerData.rows.${index}.checked`}
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
									name={`neutralizerData.rows.${index}.mass`}
									control={control}
									rules={floatRules}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
                  			{...field}
												type='text'
                  			placeholder="Mass"
                			/>
											{fieldState.error && (
												<Form.Text className='text-danger'>
													{fieldState.error.message}
												</Form.Text>
											)}
										</>
									)}
								/>
              </td>
              <td>
								<Controller
									name={`neutralizerData.rows.${index}.type`}
									control={control}
									defaultValue={[]} 
									render={({ field }) => (
										<Form.Control
											as="select"
											multiple
											value={field.value}
											onChange={(e) => {
												const selectedValues = Array.from(
													e.target.selectedOptions,
													option => option.value
												);
												field.onChange(selectedValues);
											}} 
										>
											<option value="0">Type 0</option>
											<option value="1">Type 1</option>
											<option value="2">Type 2</option>
										</Form.Control>
									)}
								/>
								{console.log(rows)}
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.modalPosition}
                  //onChange={(e) => handleInputChange(row.id, 'modalPosition', e.target.value)}
                  placeholder="[0,1,4,7]"
                />
              </td>
              <td>
								<Controller 
									name={`neutralizerData.rows.${index}.natFreqLower`} 
									control={control}
									rules={getRulesNaturalFreqLowerBound(row.id)}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
												type="text"
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
									name={`neutralizerData.rows.${index}.natFreqUpper`} 
									control={control}
									rules={getRulesNaturalFreqUpperBound(row.id)}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
												type="text"
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
									name={`neutralizerData.rows.${index}.natFreqDisc`}
									control={control}
									rules={intRules}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
                  			{...field}
												type="text"
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
									name={`neutralizerData.rows.${index}.dampingRatioLower`}
									control={control}
									rules={rows?.[index]?.type.includes('1') ? getRulesDampingRatioLowerBound(row.id) : undefined}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control 
												{...field} 
												type='text'
												disabled={!rows?.[index]?.type.includes('1')}
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
									name={`neutralizerData.rows.${index}.dampingRatioUpper`}
									control={control}
									rules={rows?.[index]?.type.includes('1') ? getRulesDampingRatioUpperBound(row.id) : undefined}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control 
												{...field}
												type='text'
												disabled={!rows?.[index]?.type.includes('1')}
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
									name={`neutralizerData.rows.${index}.dampingRatioDisc`}
									control={control}
									rules={intRules}
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
												type="text"
												disabled={!rows?.[index]?.type.includes('1')}
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
                <Form.Control
                  type="text"
                  value={row.viscoelasticMaterial}
                  //onChange={(e) => handleInputChange(row.id, 'viscoelasticMaterial', e.target.value)}
                  placeholder="[Material1, Material2]"
                  disabled={!rows?.[index]?.type.includes('2')}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={row.dynamicStiffness}
                  onChange={(e) => handleInputChange(row.id, 'dynamicStiffness', e.target.value)}
                  //placeholder="[Stiffness1, Stiffness2]"
                  disabled={!(rows?.[index]?.type.includes('0'))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ViscoelasticMaterials control={control} errors={errors} getValues={getValues}/>
      <DynamicStiffness />
    </div>
  );
};

export default NeutralizerData;