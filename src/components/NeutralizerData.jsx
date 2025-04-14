import React, { useState } from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form'
import { Table, Button, Form } from 'react-bootstrap';
import ViscoelasticMaterials from './ViscoelasticMaterials';
import DynamicStiffness from './DynamicStiffness';

const NeutralizerData = ({ control, errors, getValues, setValue, clearErrors }) => {
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

	const getRulesNaturalFreqLowerBound = (rowIndex) => ({
		...floatRules,
		validate: (value) => {
			const upperBound = rows[rowIndex].natFreqUpper
		
			if (!value || !upperBound)
				return true
	
			return (parseFloat(upperBound) < parseFloat(value)) 
				|| 'Value must be higher than Natural Frequency Lower Bound'
		}
	})

	const getRulesNaturalFreqUpperBound = (rowIndex) => ({
		...floatRules,
		validate: (value) => {
			const lowerBound = rows[rowIndex].natFreqLower
		
			if (!value || !lowerBound)
				return true

			return (parseFloat(lowerBound) < parseFloat(value)) 
				|| 'Value must be higher than Natural Frequency Lower Bound'
		}
	})

	const getRulesDampingRatioLower = (rowIndex) => {
		const typeIncludes1 = rows?.[rowIndex]?.type?.includes('1');
		
		if (!typeIncludes1) {
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

				return parseFloat(value) < parseFloat(upperBound) 
					|| 'Value must be lower than Damping Ratio Upper Bound';
			}
		};
	};

	const getRulesDampingRatioUpper = (rowIndex) => {
		const typeIncludes1 = rows?.[rowIndex]?.type?.includes('1');

		if (!typeIncludes1) {
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

				return parseFloat(value) > parseFloat(lowerBound) 
					|| 'Value must be lower than Damping Ratio Upper Bound';
			}
		};
	};

	const getRulesDampingRatioDiscretization = (rowIndex) => {
		const typeIncludes1 = rows?.[rowIndex]?.type?.includes('1');

		if (!typeIncludes1) {
			return {
				required: false
			};
		}

		return { 
			...intRules
		}
	}	

  const removeNeutralizers = () => {
		const currentRows = (rows || [])

		const indexesToRemove = currentRows
			.map((row, index) => (row?.checked ? index : -1))
			.filter(index => index !== -1)
			.sort((a,b) => b - a);

		indexesToRemove.forEach(index => remove(index))
	};

	const handleTypeChange = (e, fieldOnChange, rowIndex) => {
		const selectedValues = Array.from(
			e.target.selectedOptions,
			option => option.value
		);

		fieldOnChange(selectedValues)

		if (!selectedValues.includes('0')) {
			setValue(`neutralizerData.rows.${rowIndex}.dynamicStiffness`, '')

			clearErrors([
				`neutralizerData.rows.${rowIndex}.dynamicStiffness`
			])
		}

		if (!selectedValues.includes('1')) {
			setValue(`neutralizerData.rows.${rowIndex}.dampingRatioLower`, '');
			setValue(`neutralizerData.rows.${rowIndex}.dampingRatioUpper`, '');
			setValue(`neutralizerData.rows.${rowIndex}.dampingRatioDisc`, '');	
		
	
			clearErrors([
				`neutralizerData.rows.${rowIndex}.dampingRatioLower`,
				`neutralizerData.rows.${rowIndex}.dampingRatioUpper`,
				`neutralizerData.rows.${rowIndex}.dampingRatioDisc`
			]);
		}

		if (!selectedValues.includes('2')) {
			setValue(`neutralizerData.rows.${rowIndex}.viscoelasticMaterial`, '');

			clearErrors([
				`neutralizerData.rows.${rowIndex}.viscoelasticMaterial`
			])
		}		
	}


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
									defaultValue={[0]} 
									render={({ field }) => (
										<Form.Control
											as="select"
											multiple
											value={field.value}
											/* onChange={(e) => {
												const selectedValues = Array.from(
													e.target.selectedOptions,
													option => option.value
												);
												field.onChange(selectedValues);
											}} */ 
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
									rules={getRulesNaturalFreqLowerBound(index)}
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
									rules={getRulesNaturalFreqUpperBound(index)}
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
									rules={getRulesDampingRatioLower(index)}
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
									rules={getRulesDampingRatioUpper(index)}
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
									rules={getRulesDampingRatioDiscretization(index)}
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
								<Controller 
									name={`neutralizerData.rows.${index}.viscoelasticMaterial`}
									control={control}
									rules={ { required: 'This field is required' } }
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
                			<Form.Control
												{...field}
                  			type="text"
                        placeholder="[Material1, Material2]"
                  			disabled={!rows?.[index]?.type.includes('2')}
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
									name={`neutralizerData.rows.${index}.dynamicStiffness`}
									control={control}
									rules={ {required: 'This field is required. '} }
									defaultValue=''
									render={({ field, fieldState }) => (
										<>
											<Form.Control
												{...field}
                  			type="text"
                  			placeholder="[Stiffness1, Stiffness2]"
                  			disabled={!(rows?.[index]?.type.includes('0'))}
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

      <ViscoelasticMaterials control={control} errors={errors} getValues={getValues}/>
      <DynamicStiffness />
    </div>
  );
};

export default NeutralizerData;